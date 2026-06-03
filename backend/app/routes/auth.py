from datetime import datetime, timedelta, timezone
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    ResendCodeRequest,
    UserLogin,
    UserRegister,
    UserResponse,
    VerifyEmailRequest,
)
from app.services.email_service import send_verification_email
from app.utils.dependencies import get_current_user
from app.utils.email import is_gmail_address
from app.utils.security import create_access_token, hash_password, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])

GMAIL_ONLY_MESSAGE = "Only Gmail addresses are allowed for now."
PASSWORD_SAFETY_MESSAGE = "Password is too similar to your name or email."
VERIFY_BEFORE_LOGIN_MESSAGE = "Please verify your email before logging in."
GENERIC_RESEND_MESSAGE = "If this account exists, a verification code has been sent."
CODE_EXPIRY_MINUTES = 10


def generate_verification_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def get_code_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=CODE_EXPIRY_MINUTES)


def is_password_too_similar(password: str, name: str, email: str) -> bool:
    normalized_password = password.strip().lower()
    normalized_name = name.strip().lower()
    normalized_email = email.strip().lower()
    email_username = normalized_email.split("@")[0]

    if len(password) < 6:
        return True

    if normalized_password == normalized_name:
        return True

    if normalized_password == normalized_email:
        return True

    return bool(email_username) and email_username in normalized_password


def is_code_expired(expires_at: datetime | None) -> bool:
    if not expires_at:
        return True

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    return datetime.now(timezone.utc) > expires_at


def save_new_verification_code(user: User, db: Session) -> str:
    code = generate_verification_code()
    user.verification_code_hash = hash_password(code)
    user.verification_code_expires_at = get_code_expiry()
    db.commit()
    db.refresh(user)
    return code


def delete_unverified_user(user: User, db: Session) -> None:
    db.delete(user)
    db.commit()


def send_code_or_raise(email: str, code: str):
    try:
        send_verification_email(email, code)
    except Exception as error:
        print(f"Verification email failed for {email}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Verification email could not be sent. Please try again.",
        ) from error


def ensure_verified_user_can_login(user: User):
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=VERIFY_BEFORE_LOGIN_MESSAGE,
        )


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    email = user_data.email.lower()

    if not is_gmail_address(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=GMAIL_ONLY_MESSAGE,
        )

    if is_password_too_similar(user_data.password, user_data.name, email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=PASSWORD_SAFETY_MESSAGE,
        )

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user and existing_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    if existing_user and not existing_user.is_verified:
        delete_unverified_user(existing_user, db)

    code = generate_verification_code()
    user = User(
        name=user_data.name,
        email=email,
        password_hash=hash_password(user_data.password),
        is_verified=False,
        verification_code_hash=hash_password(code),
        verification_code_expires_at=get_code_expiry(),
    )

    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    send_code_or_raise(email, code)

    return {
        "message": "Account created. Please verify your email.",
        "email": email,
    }


@router.post("/verify-email")
def verify_email(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    email = request.email.lower()
    user = db.query(User).filter(User.email == email).first()

    if (
        not user
        or not user.verification_code_hash
        or is_code_expired(user.verification_code_expires_at)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code.",
        )

    if not verify_password(request.code, user.verification_code_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code.",
        )

    user.is_verified = True
    user.verification_code_hash = None
    user.verification_code_expires_at = None
    db.commit()

    return {"message": "Email verified successfully."}


@router.post("/resend-code")
def resend_code(request: ResendCodeRequest, db: Session = Depends(get_db)):
    email = request.email.lower()
    user = db.query(User).filter(User.email == email).first()

    if user and not user.is_verified:
        code = save_new_verification_code(user, db)
        send_code_or_raise(email, code)

    return {"message": GENERIC_RESEND_MESSAGE}


@router.post("/login")
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    email = user_data.email.lower()

    if not is_gmail_address(email):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=GMAIL_ONLY_MESSAGE,
        )

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_verified:
        code = save_new_verification_code(user, db)
        send_code_or_raise(email, code)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. A new verification code was sent.",
        )

    access_token = create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user),
    }


@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    email = form_data.username.lower()

    if not is_gmail_address(email):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=GMAIL_ONLY_MESSAGE,
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_verified:
        code = save_new_verification_code(user, db)
        send_code_or_raise(email, code)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. A new verification code was sent.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        ensure_verified_user_can_login(user)
    except HTTPException as error:
        error.headers = {"WWW-Authenticate": "Bearer"}
        raise error

    access_token = create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

