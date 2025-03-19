from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import mistral, templates, compiler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8085"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mistral.router)
app.include_router(templates.router)
app.include_router(compiler.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server!"}
