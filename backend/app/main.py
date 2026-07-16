from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import auth, users, orders, analytics

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Admin Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # add your deployed frontend URL here too
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {"message": "Admin Dashboard API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
