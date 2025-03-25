import os
import fitz
from fastapi import APIRouter, UploadFile, HTTPException
print(fitz.__doc__)
router = APIRouter()

@router.post("/extract-text")
async def extract_text(file: UploadFile):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are supported.")

    try:
        contents = await file.read()
        pdf_path = f"./temp/{file.filename}"
        
        os.makedirs("./temp", exist_ok=True)
        with open(pdf_path, "wb") as f:
            f.write(contents)

        # Open the PDF and extract text
        extracted_text = ""
        doc = None
        
        try:
            doc = fitz.open(pdf_path)
            for page in doc:
                extracted_text += page.get_text()
        finally:
            if doc:
                doc.close()  # ✅ Ensure the file is properly closed

        # ✅ Delete after closing the file
        os.remove(pdf_path)

        return {"extracted_text": extracted_text}

    except Exception as e:
        raise HTTPException(500, f"Failed to process PDF: {str(e)}")
