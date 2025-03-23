import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface LatexEditorProps {
  latexCode: string;            // Full .tex code including marker lines
  setLatexCode: (code: string) => void;
}

/**
 * We hide lines starting with '%' from the display.
 * buildDisplayLines returns display lines + a lineMap telling
 * us which original line each displayed line came from.
 */
function buildDisplayLines(originalText: string) {
  const originalLines = originalText.split("\n");
  const displayLines: string[] = [];
  const lineMap: number[] = [];

  for (let i = 0; i < originalLines.length; i++) {
    const line = originalLines[i];
    // skip lines that start with '%'
    if (line.trim().startsWith("%")) {
      continue;
    }
    displayLines.push(line);
    lineMap.push(i);
  }
  return { displayLines, lineMap };
}

/**
 * Put changed display lines back into the original text
 * while preserving the hidden lines (comments, markers).
 */
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

/**
 * Finds the difference (the substring that was removed)
 * between `oldStr` and `newStr` in a naive way:
 *  - find the first index from left where they differ
 *  - find the first index from right where they differ
 *  - the substring in oldStr between those indexes is "removed"
 */
function findRemoval(oldStr: string, newStr: string): string | null {
  // If new is longer or equal, we do not treat it as a removal
  if (newStr.length >= oldStr.length) {
    return null;
  }

  let start = 0;
  const minLen = Math.min(oldStr.length, newStr.length);
  // move from left while they match
  while (start < minLen && oldStr[start] === newStr[start]) {
    start++;
  }
  // if we consumed entire newStr, the rest is removed
  if (start === newStr.length && newStr.length < oldStr.length) {
    return oldStr.slice(start);
  }

  let endOld = oldStr.length - 1;
  let endNew = newStr.length - 1;
  // move from right while they match
  while (endOld >= 0 && endNew >= 0 && oldStr[endOld] === newStr[endNew]) {
    endOld--;
    endNew--;
  }

  if (endOld >= start) {
    // substring in oldStr that was removed
    return oldStr.slice(start, endOld + 1);
  }
  return null;
}

/**
 * Attempt to find which marker block the user is in, if any
 */
function findMarkerBlockForLine(originalLines: string[], lineIndex: number): string | null {
  interface Block { id: string; start: number; end: number; }
  const blocks: Block[] = [];

  originalLines.forEach((line, idx) => {
    const beginMatch = line.match(/^% BEGIN_([^\s]+)/);
    const endMatch = line.match(/^% END_([^\s]+)/);
    if (beginMatch) {
      blocks.push({ id: beginMatch[1], start: idx, end: -1 });
    } else if (endMatch) {
      const blk = blocks.find(b => b.id === endMatch[1] && b.end === -1);
      if (blk) {
        blk.end = idx;
      }
    }
  });
  // If no end, treat to last line
  blocks.forEach(b => {
    if (b.end === -1) b.end = originalLines.length - 1;
  });

  for (const b of blocks) {
    if (b.start <= lineIndex && lineIndex <= b.end) {
      return b.id;
    }
  }
  return null;
}

const LatexEditor: React.FC<LatexEditorProps> = ({ latexCode, setLatexCode }) => {
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [lineMap, setLineMap] = useState<number[]>([]);
  const oldDisplayRef = useRef<string>("");  // track the old display text

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Build display lines for user
  useEffect(() => {
    const { displayLines, lineMap } = buildDisplayLines(latexCode);
    setDisplayLines(displayLines);
    setLineMap(lineMap);
    // store the joined text in oldDisplayRef for comparison
    oldDisplayRef.current = displayLines.join("\n");
  }, [latexCode]);

  const displayText = displayLines.join("\n");

  // On user typing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDisplayText = e.target.value;
    const oldDisplayText = oldDisplayRef.current;
    // check if there's a removal
    const removed = findRemoval(oldDisplayText, newDisplayText);
    if (removed) {
      console.log(`removed "${removed}"`);
    }

    // Now update local state
    const newDisplayLines = newDisplayText.split("\n");
    setDisplayLines(newDisplayLines);

    // Rebuild the original code and pass up
    const newOriginal = reconstructOriginalText(newDisplayLines, lineMap, latexCode);
    setLatexCode(newOriginal);

    // Update oldDisplayRef
    oldDisplayRef.current = newDisplayText;
  };

  // On user clicking in the text area
  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!textareaRef.current) return;
    const textArea = textareaRef.current;

    const position = textArea.selectionStart;
    const upToCursor = displayText.slice(0, position);
    const linesSoFar = upToCursor.split("\n");
    const displayLineIndex = linesSoFar.length - 1;
    if (displayLineIndex < 0) {
      console.log("Clicked, no line found");
      return;
    }
    const colInLine = linesSoFar[displayLineIndex].length;
    const origLineIndex = lineMap[displayLineIndex];
    if (origLineIndex == null) {
      console.log("Clicked, but line map missing");
      return;
    }

    // see if there's a block
    const originalLines = latexCode.split("\n");
    const blockId = findMarkerBlockForLine(originalLines, origLineIndex);
    if (blockId) {
      console.log(`Inside block: ${blockId}`);
    } else {
      console.log("No marker block found for that line.");
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] flex items-center">
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="m18 16 4-4-4-4"/>
              <path d="m6 8-4 4 4 4"/>
              <path d="m14.5 4-5 16"/>
            </svg>
          </span>
          LaTeX Editor
        </h2>
      </div>

      <div className="relative flex-1 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary-dark)] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <textarea
          ref={textareaRef}
          className="relative h-full w-full p-4 bg-[var(--dark-card-bg)] text-[var(--dark-text-primary)]
                     border border-[var(--primary-dark)] rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                     text-sm md:text-base font-mono resize-none
                     shadow-inner transition-all duration-300"
          value={displayText}
          onChange={handleChange}
          onClick={handleClick}
          spellCheck={false}
          style={{ lineHeight: 1.6 }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-[var(--dark-text-muted)]">
        <div>{displayText.length} characters</div>
      </div>
    </motion.div>
  );
};

export default LatexEditor;