import os
from mistralai import Mistral
from fastapi import FastAPI

app = FastAPI()
api_key = "CstFGdrrqWVTyfbPt3O3qGGngpRUY2hK"
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

@app.get("/mistral")
async def mistral():
    chat_response = client.chat.complete(
        model = model,
        messages = [
            {
                "role": "user",
                "content": "What is the best French cheese?",
            },
        ]
    )

    return(chat_response.choices[0].message.content)
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server!"}