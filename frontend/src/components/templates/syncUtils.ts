export function applyHtmlEditsToLatex(
  latex: string,
  edits: Record<string, string>
): string {
  return latex.replace(/% BEGIN_(\w+)([\s\S]*?)% END_\1/g, (match, id, body) => {
    if (!edits[id]) return match;
    return `% BEGIN_${id}\n${edits[id]}\n% END_${id}`;
  });
}
export function extractHtmlEdits(doc: Document): Record<string, string> {
  const changes: Record<string, string> = {};
  const elements = doc.querySelectorAll("[data-latex-id]");

  elements.forEach((el) => {
    const id = el.getAttribute("data-latex-id");
    if (id) {
      changes[id] = (el as HTMLElement).innerText.trim();
    }
  });

  return changes;
}
export function injectDataIdsIntoHtml(html: string, latexCode: string): string {
  const ids = [...latexCode.matchAll(/% BEGIN_(\S+)/g)].map(m => m[1]);
  let updatedHtml = html;

  ids.forEach(id => {
    const regex = new RegExp(`(<div[^>]*class="[^"]*"[^>]*>[^<]*${id}[^<]*</div>)`);
    updatedHtml = updatedHtml.replace(regex, match => {
      if (!match.includes('data-latex-id')) {
        return match.replace('<div', `<div data-latex-id="${id}"`);
      }
      return match;
    });
  });

  return updatedHtml;
}
export function injectLatexIntoHtml(html: string, latex: string): string {   
  const parser = new DOMParser();   
  const doc = parser.parseFromString(html, 'text/html');    
  
  const blockRegex = /% BEGIN_(\w+)([\s\S]*?)% END_\1/g;   
  const blocks: Record<string, { 
    content: string, 
    elements: HTMLElement[] 
  }> = {};    

  let match;   
  while ((match = blockRegex.exec(latex)) !== null) {     
    const blockId = match[1];     
    const content = match[2].trim();     
    
    // Find all elements with this block ID
    const elements = Array.from(
      doc.querySelectorAll(`[data-latex-id="${blockId}"]`)
    ) as HTMLElement[];
    
    blocks[blockId] = { content, elements };   
  }    

  Object.entries(blocks).forEach(([id, { content, elements }]) => {     
    if (!elements.length) return;

    const lines = content       
      .split(/\r?\n/)       
      .map(line => line.trim())       
      .filter(Boolean);      

    const extractTextInBraces = (line: string): string[] => {       
      const matches = [...line.matchAll(/\{([^}]*)\}/g)];       
      return matches.map(m => m[1].trim());     
    };      

    elements.forEach(target => {
      // Only allow text changes: update only the text content inside the block
      // We'll scan child nodes and replace their text content with matching LaTeX lines
      const textNodes: HTMLElement[] = Array.from(target.querySelectorAll('*'))       
        .filter(el => el.children.length === 0) as HTMLElement[];      

      for (let i = 0; i < Math.min(lines.length, textNodes.length); i++) {       
        const parts = extractTextInBraces(lines[i]);       
        textNodes[i].textContent = parts.join(' ').trim();     
      }   
    });
  });    

  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML; 
}