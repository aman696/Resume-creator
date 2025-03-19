import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/templates")

@router.get("/{template_id}")
async def get_template(template_id: int):
    if not (1 <= template_id <= 100000):
        raise HTTPException(400, "Template ID must be between 1 and 100000")

    template_path = os.path.join("resume", f"template{template_id}.tex")
    
    if not os.path.exists(template_path):
        raise HTTPException(404, "Template not found")

    with open(template_path, "r") as f:
        content = f.read()
    
    return {"content": content}
