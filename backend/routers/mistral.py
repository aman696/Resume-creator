from fastapi import APIRouter, HTTPException
from mistralai import Mistral
import os
router = APIRouter()

# Mistral Config
api_key = os.getenv("MISTRAL_API_KEY")
model = "mistral-small-latest"
client = Mistral(api_key=api_key)

# ✅ Endpoint 1: Modify existing text directly
@router.post("/modify-text")
async def modify_text(data: dict):
    text = data.get("text", "")
    prompt = data.get("prompt", "")

    if not text or not prompt:
        raise HTTPException(status_code=400, detail="Text and prompt are required")

    # Send the modification request to Mistral
    chat_response = client.chat.complete(
        model=model,
        messages=[
            {"role": "user", "content": f"Modify the following text based on the prompt:\n\nText:\n{text}\n\nPrompt:\n{prompt}"}
        ]
    )

    modified_content = chat_response.choices[0].message.content
    return {"modified_text": modified_content}


# ✅ Endpoint 2: Fit into existing LaTeX template (no structural changes)
@router.post("/fit-latex")
async def fit_latex(data: dict):
    latex_template = data.get("latex_template", "")
    information = data.get("information", "")

    if not latex_template or not information:
        raise HTTPException(status_code=400, detail="LaTeX template and information are required")

    # Send the request to Mistral for fitting into the LaTeX template
    chat_response = client.chat.complete(
        model=model,
        messages=[
            {"role": "user", "content": f"Fill the following LaTeX template with the provided information:\n\nLaTeX Template:\n{latex_template}\n\nInformation:\n{information}"}
        ]
    )

    filled_latex = chat_response.choices[0].message.content
    return {"filled_latex": filled_latex}
