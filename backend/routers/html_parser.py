# routers/html_parser.py
import re
from typing import Union, List, Dict, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from html.parser import HTMLParser

router = APIRouter()

# -------------------------------
# HTML Parser for DOM Tree
# -------------------------------

HTMLNode = Dict[str, Union[str, List["HTMLNode"], Dict[str, str]]]

class DOMTreeParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root: List[HTMLNode] = []
        self.stack: List[HTMLNode] = []
        
    def handle_starttag(self, tag: str, attrs: List[tuple]) -> None:
        attributes = {attr[0]: attr[1] for attr in attrs}
        node: HTMLNode = {
            "type": "element",
            "tag": tag,
            "attributes": attributes,
            "children": []
        }
        
        if self.stack:
            self.stack[-1]["children"].append(node)
        else:
            self.root.append(node)
            
        # Don't push self-closing tags onto the stack
        if tag not in ('img', 'br', 'hr', 'input', 'meta', 'link'):
            self.stack.append(node)
            
    def handle_endtag(self, tag: str) -> None:
        # Find the matching start tag and pop everything after it
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["tag"] == tag:
                self.stack = self.stack[:i]
                break
                
    def handle_data(self, data: str) -> None:
        # Only add non-empty text nodes
        data = data.strip()
        if not data:
            return
            
        node = {
            "type": "text",
            "content": data
        }
        
        if self.stack:
            self.stack[-1]["children"].append(node)
        else:
            self.root.append(node)
    
    def handle_comment(self, data: str) -> None:
        node = {
            "type": "comment",
            "content": data
        }
        
        if self.stack:
            self.stack[-1]["children"].append(node)
        else:
            self.root.append(node)
            
    def get_dom_tree(self) -> List[HTMLNode]:
        return self.root

def parse_html_to_dom(html: str) -> List[HTMLNode]:
    parser = DOMTreeParser()
    parser.feed(html)
    return parser.get_dom_tree()

class HTMLRequest(BaseModel):
    code: str

@router.post("/parse-html")
async def parse_html_endpoint(payload: HTMLRequest):
    try:
        dom_tree = parse_html_to_dom(payload.code)
        return {"status": "success", "dom": dom_tree}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse HTML: {str(e)}")