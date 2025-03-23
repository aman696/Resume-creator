// Example: Replaces content in latexString based on `data-latex-id` in htmlString
export function syncHtmlToLatex(htmlString: string, latexString: string): string {
    let updatedLatex = latexString;
  
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
  
    const elements = doc.querySelectorAll("[data-latex-id]");
    elements.forEach((el) => {
      const blockId = el.getAttribute("data-latex-id");
      if (!blockId) return;
  
      // The new text from HTML – e.g. innerText or textContent.
      const newText = el.textContent?.trim() || "";
  
      // In your .tex, you might have:
      // % BEGIN_blockId
      //   ...stuff...
      // % END_blockId
      const regex = new RegExp(`(% BEGIN_${blockId}[\\s\\S]*?% END_${blockId})`, "m");
      // We'll replace the entire block with that same block, but our new text in between
      const replacement = `% BEGIN_${blockId}\n${newText}\n% END_${blockId}`;
  
      updatedLatex = updatedLatex.replace(regex, replacement);
    });
  
    return updatedLatex;
  }
  
  // Example: Replaces content in htmlString based on blocks in latexString
  export function syncLatexToHtml(latexString: string, htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
  
    // Regex to find % BEGIN_id ... % END_id
    const blockRegex = /% BEGIN_([^\s]+)([\s\S]*?)% END_\1/g;
    let match;
    while ((match = blockRegex.exec(latexString)) !== null) {
      const blockId = match[1];
      const content = match[2].trim();
  
      // In the HTML, find the data-latex-id
      const el = doc.querySelector(`[data-latex-id="${blockId}"]`);
      if (el) {
        // Overwrite text. (Or do el.innerHTML = content, if you have HTML.)
        el.textContent = content;
      }
    }
  
    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  }
export function highlightInHtml(
  htmlString: string,
  blockId: string,
  highlight: boolean
): string {
  // We'll parse the HTML, find the element with data-latex-id="blockId",
  // add or remove an inline style or a class for highlight.

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const el = doc.querySelector(`[data-latex-id="${blockId}"]`);
  if (!el) {
    // not found, just return unchanged
    return htmlString;
  }

  if (highlight) {
    el.setAttribute("style", "background: yellow;");
  } else {
    // remove the style or set it to empty
    el.removeAttribute("style");
  }

  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
}
// highlightInLatex(latexString, blockId, highlight = true)
export function highlightInLatex(
    latexString: string,
    blockId: string,
    highlight: boolean
  ): string {
    // We'll find the block: % BEGIN_blockId ... % END_blockId
    // and insert a comment line or wrap it in some macro.
    // e.g. \hlstart ... \hlend
  
    // Simple approach: wrap the entire block with some custom latex markup
    // e.g. "<<<HIGHLIGHT_START>>> ... <<<HIGHLIGHT_END>>>"
    // or if you want an actual LaTeX macro, do something like:
    // \hlstart
    // block content
    // \hlend
  
    const blockRegex = new RegExp(
      `(\\% BEGIN_${blockId}[\\s\\S]*?\\% END_${blockId})`,
      "m"
    );
  
    // If not found, return unchanged
    if (!blockRegex.test(latexString)) {
      return latexString;
    }
  
    // If highlight = true, we add markers. If false, we remove them.
    if (highlight) {
      // Add some markers around the entire block
      return latexString.replace(blockRegex, (match) => {
        return `\\hlstart\n${match}\n\\hlend`;
      });
    } else {
      // remove existing highlight macros if present
      // e.g. if we see \hlstart ... \hlend, remove them
      return latexString.replace(blockRegex, (match) => {
        const removeHl = match.replace(/\\hlstart\s*/g, "").replace(/\\hlend\s*/g, "");
        return removeHl;
      });
    }
  }
  