import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";

interface LatexEditorProps {
  latexCode: string;
  setLatexCode: (code: string) => void;
}

function buildDisplayLines(originalText: string) {
  const originalLines = originalText.split("\n");
  const displayLines = [...originalLines];
  const lineMap = originalLines.map((_, idx) => idx);
  return { displayLines, lineMap };
}

function reconstructOriginalText(
  displayLines: string[],
  lineMap: number[],
  originalText: string
): string {
  const originalLines = originalText.split("\n");
  const updated = [...originalLines];
  displayLines.forEach((dispLine, idx) => {
    const origIndex = lineMap[idx];
    if (origIndex != null) {
      updated[origIndex] = dispLine;
    }
  });
  return updated.join("\n");
}

function findRemoval(oldStr: string, newStr: string): string | null {
  if (newStr.length >= oldStr.length) return null;
  let start = 0;
  const minLen = Math.min(oldStr.length, newStr.length);
  while (start < minLen && oldStr[start] === newStr[start]) start++;
  if (start === newStr.length && newStr.length < oldStr.length) {
    return oldStr.slice(start);
  }
  let endOld = oldStr.length - 1;
  let endNew = newStr.length - 1;
  while (endOld >= 0 && endNew >= 0 && oldStr[endOld] === newStr[endNew]) {
    endOld--;
    endNew--;
  }
  if (endOld >= start) return oldStr.slice(start, endOld + 1);
  return null;
}
function validateLatexMarkers(code: string) {
  const beginMarkers = (code.match(/% BEGIN_\w+/g) || []);
  const endMarkers: string[] = (code.match(/% END_\w+/g) || []);

  const errors: string[] = [];
  
  if (beginMarkers.length !== endMarkers.length) {
    errors.push("Unbalanced markers: Number of BEGIN and END markers do not match.");
  }

  const unmatchedBegins = beginMarkers.filter(
    begin => !endMarkers.includes(begin.replace('BEGIN', 'END'))
  );

  if (unmatchedBegins.length > 0) {
    errors.push(`Unmatched BEGIN markers: ${unmatchedBegins.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Enhance findMarkerBlockForLine to provide more context
function findMarkerBlockForLine(originalLines: string[], lineIndex: number): { 
  blockId: string | null, 
  blockStart: number, 
  blockEnd: number,
  isMarkerLine: boolean 
} {
  const blocks: Array<{
    id: string, 
    start: number, 
    end: number
  }> = [];

  originalLines.forEach((line, idx) => {
    const beginMatch = line.match(/^% BEGIN_(\w+)/);
    const endMatch = line.match(/^% END_(\w+)/);
    
    if (beginMatch) {
      blocks.push({ 
        id: beginMatch[1], 
        start: idx, 
        end: -1 
      });
    } else if (endMatch) {
      const blk = blocks.find(b => b.id === endMatch[1] && b.end === -1);
      if (blk) {
        blk.end = idx;
      }
    }
  });

  blocks.forEach(b => {
    if (b.end === -1) b.end = originalLines.length - 1;
  });

  for (const b of blocks) {
    if (b.start <= lineIndex && lineIndex <= b.end) {
      return {
        blockId: b.id,
        blockStart: b.start,
        blockEnd: b.end,
        isMarkerLine: lineIndex === b.start || lineIndex === b.end
      };
    }
  }

  return { 
    blockId: null, 
    blockStart: -1, 
    blockEnd: -1,
    isMarkerLine: false
  };
}

const LatexEditor: React.FC<LatexEditorProps> = ({ latexCode, setLatexCode }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [markerWarnings, setMarkerWarnings] = useState<string[]>([]);

  const handleClear = () => {
    if (viewRef.current) {
      const transaction = viewRef.current.state.update({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: '' }
      });
      viewRef.current.dispatch(transaction);
      setLatexCode('');
      setEditorError(null);
    }
  };
  // Clear editor function

  const handleLatexCodeChange = (newCode: string) => {
    const validation = validateLatexMarkers(newCode);
    
    if (!validation.isValid) {
      setMarkerWarnings(validation.errors);
    } else {
      setMarkerWarnings([]);
    }

    setLatexCode(newCode);
  };
  useEffect(() => {
    if (!editorRef.current) return;

    try {
      const { displayLines, lineMap } = buildDisplayLines(latexCode);
      const oldText = displayLines.join("\n");

      const state = EditorState.create({
        doc: oldText,
        extensions: [
          basicSetup,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newText = update.state.doc.toString();
              const removed = findRemoval(oldText, newText);
              
              // Validate markers on each change
              const validation = validateLatexMarkers(newText);
              if (!validation.isValid) {
                setMarkerWarnings(validation.errors);
              } else {
                setMarkerWarnings([]);
              }

              if (removed) {
                console.log(`removed "${removed}"`);
              }

              const newLines = newText.split("\n");
              const newOriginal = reconstructOriginalText(newLines, lineMap, latexCode);
              handleLatexCodeChange(newOriginal);
            }
          }),
        ],
      });
      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      viewRef.current = view;

      return () => {
        view.destroy();
      };
    } catch (error) {
      setEditorError('Failed to initialize editor');
      console.error(error);
    }
  }, [latexCode]);

  const handleClick = () => {
    if (!viewRef.current) return;

    try {
      const pos = viewRef.current.state.selection.main.head;
      const text = viewRef.current.state.doc.toString();
      const lines = text.split("\n");
      let line = 0,
        charCount = 0;
      while (line < lines.length && charCount + lines[line].length < pos) {
        charCount += lines[line].length + 1;
        line++;
      }

      const originalLines = latexCode.split("\n");
      const { blockId, blockStart, blockEnd, isMarkerLine } = findMarkerBlockForLine(originalLines, line);
      
      if (blockId) {
        console.log(`Inside block: ${blockId}`);
        
        if (isMarkerLine) {
          alert('⚠️ You are on a marker line. Modifying markers can break template synchronization.');
        }
      } else {
        console.log("No marker block found for that line.");
      }
    } catch (error) {
      setEditorError('Error processing line');
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

      <div className="relative flex-1 group">
        <div 
          ref={editorRef}
          onClick={handleClick}
          className="relative h-full 
            max-h-[600px] 
            min-h-[400px] 
            sm:min-h-[450px] 
            md:min-h-[500px] 
            lg:min-h-[550px] 
            w-full 
            rounded-lg 
            bg-[var(--dark-card-bg)] 
            border border-[var(--primary-dark)] 
            shadow-lg 
            p-4 
            text-sm md:text-base 
            font-mono 
            overflow-auto 
            focus:outline-none 
            focus:ring-2 
            focus:ring-[var(--primary)] 
            transition-all 
            duration-300"
        />
      </div>

      {editorError && (
        <div className="mt-2 text-red-500 text-sm">
          {editorError}
        </div>
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