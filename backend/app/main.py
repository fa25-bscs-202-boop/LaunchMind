from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.config import settings
from app.database import Base, add_missing_user_columns_for_sqlite, engine
from app.routes.ai import router as ai_router
from app.routes.analyses import router as analyses_router
from app.routes.auth import router as auth_router
from app.routes.competitors import router as competitors_router
from app.routes.exports import router as exports_router
from app.routes.health import router as health_router
from app.routes.ideas import router as ideas_router
from app.routes.mvp import router as mvp_router
from app.routes.oauth import router as oauth_router
from app.routes.pitch import router as pitch_router
from app.routes.projects import router as projects_router
from app.routes.reports import router as reports_router
from app.routes.swot import router as swot_router


Base.metadata.create_all(bind=engine)
add_missing_user_columns_for_sqlite()

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(analyses_router)
app.include_router(competitors_router)
app.include_router(exports_router)
app.include_router(health_router)
app.include_router(ideas_router)
app.include_router(mvp_router)
app.include_router(oauth_router)
app.include_router(pitch_router)
app.include_router(projects_router)
app.include_router(reports_router)
app.include_router(swot_router)


@app.get("/")
def read_root():
    return {
        "app": settings.APP_NAME,
        "message": "AI startup generation backend is running",
        "version": settings.APP_VERSION,
    }


