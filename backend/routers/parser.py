import re
from typing import Union, List, Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# -------------------------------
# LaTeX Parser for Structured AST
# -------------------------------

LatexNode = Union[Dict[str, Union[str, List["LatexNode"]]], str]

def parse_latex_to_ast(latex: str) -> List[LatexNode]:
    lines = latex.strip().splitlines()
    ast: List[LatexNode] = []
    stack: List[Dict] = []

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue

        # Match environment begin
        if env_start := re.match(r"\\begin\{(\w+)\}", line):
            env_name = env_start.group(1)
            env_node = {"type": "environment", "name": env_name, "children": []}
            if stack:
                stack[-1]["children"].append(env_node)
            else:
                ast.append(env_node)
            stack.append(env_node)

        # Match environment end
        elif env_end := re.match(r"\\end\{(\w+)\}", line):
            if stack and stack[-1]["type"] == "environment" and stack[-1]["name"] == env_end.group(1):
                stack.pop()
            else:
                ast.append({"type": "error", "content": f"Mismatched \\end{{{env_end.group(1)}}}"})

        # Match command with a single argument
        elif cmd := re.match(r"\\([a-zA-Z]+)\{([^{}]*)\}", line):
            node = {
                "type": "command",
                "name": cmd.group(1),
                "arg": cmd.group(2)
            }
            if stack:
                stack[-1]["children"].append(node)
            else:
                ast.append(node)

        # Match plain text
        else:
            node = {"type": "text", "content": line}
            if stack:
                stack[-1]["children"].append(node)
            else:
                ast.append(node)

    return ast
class LatexRequest(BaseModel):
    code: str

@router.post("/parse-latex")
async def parse_latex_endpoint(payload: LatexRequest):
    try:
        ast = parse_latex_to_ast(payload.code)
        return {"status": "success", "ast": ast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse LaTeX: {str(e)}")