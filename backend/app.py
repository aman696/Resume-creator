import os
from mistralai import Mistral
from fastapi import FastAPI, HTTPException

app = FastAPI()
api_key = "CstFGdrrqWVTyfbPt3O3qGGngpRUY2hK"
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

# Existing endpoint for Mistral AI
@app.get("/mistral")
async def mistral():
    chat_response = client.chat.complete(
        model=model,
        messages=[
            {
                "role": "user",
                "content": "What is the best French cheese?",
            },
        ]
    )
    return chat_response.choices[0].message.content

# Existing root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server!"}

# New endpoint to serve template1.tex
@app.get("/templates/template1")
async def get_template1():
    template_path = os.path.join("resume", "template1.tex")
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")
    with open(template_path, "r") as f:
        content = f.read()
    return {"content": content}