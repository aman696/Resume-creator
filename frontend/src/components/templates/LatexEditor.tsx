import React from 'react';
import { motion } from 'framer-motion';

interface LatexEditorProps {
  latexCode: string;
  setLatexCode: (code: string) => void;
}

const LatexEditor: React.FC<LatexEditorProps> = ({ latexCode, setLatexCode }) => {
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m18 16 4-4-4-4"></path>
              <path d="m6 8-4 4 4 4"></path>
              <path d="m14.5 4-5 16"></path>
            </svg>
          </span>
          LaTeX Editor
        </h2>
      </div>
      
      <div className="relative flex-1 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary-dark)] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <textarea
          className="relative h-full w-full p-4 bg-[var(--dark-card-bg)] text-[var(--dark-text-primary)] 
                    border border-[var(--primary-dark)] rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
                    text-sm md:text-base font-mono resize-none 
                    shadow-inner transition-all duration-300"
          value={latexCode}
          onChange={(e) => setLatexCode(e.target.value)}
          spellCheck={false}
          style={{ lineHeight: 1.6 }}
        />
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-[var(--dark-text-muted)]">
        <div>{latexCode.length} characters</div>
      </div>
    </motion.div>
  );
};

export default LatexEditor;