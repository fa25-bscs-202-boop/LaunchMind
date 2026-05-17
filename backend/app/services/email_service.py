from email.message import EmailMessage
import smtplib

from app.config import settings


def is_smtp_configured() -> bool:
    return bool(settings.SMTP_HOST and settings.SMTP_FROM_EMAIL)


def print_development_code(to_email: str, code: str):
    print("SMTP not configured. Using development console output.")
    print("================================")
    print("LaunchMind Verification Code")
    print(f"Email: {to_email}")
    print(f"Code: {code}")
    print("================================")


def send_verification_email(to_email: str, code: str):
    """Send a six-digit verification code, or print it in development."""
    if not is_smtp_configured():
        print_development_code(to_email, code)
        return

    message = EmailMessage()
    message["Subject"] = "LaunchMind AI verification code"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = to_email
    message.set_content(
        f"Your verification code is: {code}\n"
        "This code will expire in 10 minutes."
    )

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as smtp:
        smtp.starttls()
        if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        smtp.send_message(message)
