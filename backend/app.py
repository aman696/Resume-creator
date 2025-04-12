from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import mistral, templates, compiler, pdf_extractor, auth , parser
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel, OAuthFlowAuthorizationCode
from fastapi.openapi.models import SecurityScheme
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register router with prefix="/auth"
app.include_router(auth.router, prefix="/auth")
app.include_router(parser.router)
app.include_router(mistral.router)
app.include_router(templates.router)
app.include_router(compiler.router)
app.include_router(pdf_extractor.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server!"}

@app.on_event("startup")
async def list_routes():
    routes = [route.path for route in app.routes]
    print("✅ Registered Routes:", routes)
