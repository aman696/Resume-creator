// LatexEditor.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface LatexEditorProps {
  latexCode: string;
  setLatexCode: (code: string) => void;
  highlightedBlockId?: string | null;
  highlightedText?: string | null;
}

function validateLatexMarkers(code: string) {
  const beginMarkers = (code.match(/% BEGIN_\w+/g) || []);
  const endMarkers: string[] = (code.match(/% END_\w+/g) || []);
  const errors: string[] = [];

  if (beginMarkers.length !== endMarkers.length) {
    errors.push("Unbalanced markers: Number of BEGIN and END markers do not match.");
  }

  const unmatchedBegins = beginMarkers.filter(
    begin => !endMarkers.includes(begin.replace("BEGIN", "END"))
  );

  if (unmatchedBegins.length > 0) {
    errors.push(`Unmatched BEGIN markers: ${unmatchedBegins.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function getWordAt(text: string, position: number) {
  const left = text.slice(0, position).match(/[\w\\-]+$/);
  const right = text.slice(position).match(/^[\w\\-]+/);
  return (left ? left[0] : "") + (right ? right[0] : "");
}

function getLineNumber(text: string, position: number) {
  return text.substring(0, position).split("\n").length - 1;
}

function findAstNodeByLine(ast: any[], targetLine: number, currentLine = { val: 0 }): any | null {
  for (const node of ast) {
    const localLine = { ...currentLine };

    if (node.type === "text" || node.type === "command") {
      if (localLine.val === targetLine) return node;
      localLine.val++;
    }

    if (node.type === "environment" && Array.isArray(node.children)) {
      const found = findAstNodeByLine(node.children, targetLine, localLine);
      if (found) return found;
    }

    currentLine.val = localLine.val;
  }

  return null;
}

const LatexEditor: React.FC<LatexEditorProps> = ({ latexCode, setLatexCode, highlightedBlockId, highlightedText }) => {
  const [markerWarnings, setMarkerWarnings] = useState<string[]>([]);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [latexAST, setLatexAST] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (latexCode.trim()) {
      axios.post("http://localhost:8000/parse-latex", { code: latexCode })
        .then(res => setLatexAST(res.data.ast))
        .catch(err => console.error("AST Fetch Failed", err));
    }
  }, [latexCode]);

  useEffect(() => {
    if (!highlightedBlockId) return;

    const lines = latexCode.split("\n");
    const start = lines.findIndex(line => line.trim() === `% BEGIN_${highlightedBlockId}`);
    const end = lines.findIndex(line => line.trim() === `% END_${highlightedBlockId}`);

    if (start !== -1 && end !== -1 && textareaRef.current) {
      const textBefore = lines.slice(0, start).join("\n");
      const blockContent = lines.slice(start, end + 1).join("\n");
      const selectionStart = textBefore.length + (start > 0 ? 1 : 0);
      
      if (highlightedText && highlightedText.trim() !== "") {
        // Find the specific text within the block
        const blockStartPos = selectionStart;
        const textPos = blockContent.indexOf(highlightedText);
        
        if (textPos !== -1) {
          // Set selection to just the specific text
          const exactStart = blockStartPos + textPos;
          const exactEnd = exactStart + highlightedText.length;
          
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(exactStart, exactEnd);
        } else {
          // Fallback to highlighting the whole block
          const selectionEnd = selectionStart + blockContent.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
        }
      } else {
        // Fallback to highlighting the whole block
        const selectionEnd = selectionStart + blockContent.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  }, [highlightedBlockId, highlightedText, latexCode]);
  const handleClear = () => {
    setLatexCode('');
    setMarkerWarnings([]);
    setEditorError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    const validation = validateLatexMarkers(newCode);
    if (!validation.isValid) {
      setMarkerWarnings(validation.errors);
    } else {
      setMarkerWarnings([]);
    }
    setLatexCode(newCode);
  };

  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    try {
      const textarea = e.currentTarget;
      const text = textarea.value;
      const pos = textarea.selectionStart;
      const line = getLineNumber(text, pos);
      const word = getWordAt(text, pos);

      console.log("Clicked word:", word);
      console.log("Line number:", line);

      const matchNode = findAstNodeByLine(latexAST, line);
      console.log("Matched AST Node:", matchNode);
    } catch (error) {
      setEditorError('Click detection failed');
      console.error(error);
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {markerWarnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Marker Validation Warnings:</p>
          <ul className="list-disc list-inside">
            {markerWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 border-b pb-2 border-[var(--primary-dark)]">
        <h2 className="text-2xl font-bold text-[var(--primary)] flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 mr-3"
          >
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
          LaTeX Editor
        </h2>
      </div>

      <textarea
        ref={textareaRef}
        value={latexCode}
        onChange={handleChange}
        onClick={handleClick}
        className="w-full h-[500px] p-4 border border-[var(--primary-dark)] rounded-lg bg-[var(--dark-card-bg)] text-sm md:text-base font-mono shadow focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300"
      />

      {editorError && (
        <div className="mt-2 text-red-500 text-sm">{editorError}</div>
      )}

      <div className="mt-2 flex justify-between items-center text-xs text-[var(--dark-text-muted)]">
        <span>{latexCode.length} characters</span>
        <button
          className="text-[var(--primary)] hover:text-[var(--secondary)] transition"
          onClick={handleClear}
        >
          Clear Editor
        </button>
      </div>
    </motion.div>
  );
};

export default LatexEditor;