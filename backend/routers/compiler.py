import subprocess
import tempfile
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import FileResponse
from fastapi import Response

router = APIRouter(prefix="/compiler")

class LatexRequest(BaseModel):
    latex_code: str

@router.post("/compile")
async def compile_latex(request: LatexRequest):
    with tempfile.TemporaryDirectory() as tmpdirname:
        tex_file = os.path.join(tmpdirname, "document.tex")
        pdf_file = os.path.join(tmpdirname, "document.pdf")
        
        # 1. Write LaTeX into document.tex
        with open(tex_file, "w", encoding='utf-8') as f:
            f.write(request.latex_code)

        # 2. Call Tectonic
        tectonic_path = os.path.join(os.path.dirname(__file__), "tectonic.exe")
        result = subprocess.run(
            [tectonic_path, "--outdir", tmpdirname, tex_file],
            capture_output=True,
            check=True,
            timeout=30
        )
        print("stdout:", result.stdout.decode())
        print("stderr:", result.stderr.decode())

        # 3. Read the compiled PDF into memory
        if not os.path.exists(pdf_file):
            raise HTTPException(status_code=500, detail="PDF not generated by Tectonic.")

        with open(pdf_file, "rb") as pdf_f:
            pdf_bytes = pdf_f.read()

    # 4. Return PDF bytes as an HTTP response
    #    (outside `with` so the temp dir can be deleted safely)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=compiled.pdf"}
    )