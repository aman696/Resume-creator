from fastapi import APIRouter
from mistralai import Mistral

router = APIRouter()

api_key = "CstFGdrrqWVTyfbPt3O3qGGngpRUY2hK"
model = "mistral-small-latest"
client = Mistral(api_key=api_key)

@router.get("/mistral")
async def mistral():
    chat_response = client.chat.complete(
        model=model,
        messages=[
            {"role": "user", "content": "What is the best French cheese?"},
        ]
    )
    return {"response": chat_response.choices[0].message.content}
