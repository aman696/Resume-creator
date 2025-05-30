'use client';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LatexEditor from '@/components/templates/LatexEditor';
import PdfPreviewCompiler from '@/components/templates/PdfPreviewCompiler';
import { applyHtmlEditsToLatex } from '@/components/templates/syncUtils';
const TemplateEditing = () => {
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);
  const { state } = useLocation();
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const initialLatex = state?.latex || '';
  const [latexCode, setLatexCode] = useState(initialLatex);
  const [isMobilePanelEditor, setIsMobilePanelEditor] = useState(true);
  const templateId = state?.templateId;
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setHighlightedBlockId(customEvent.detail);
    };
  
    window.addEventListener("latex-block-click", handler);
    return () => window.removeEventListener("latex-block-click", handler);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobilePanelEditor(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail;
      
      if (typeof detail === 'object') {
        setHighlightedBlockId(detail.blockId);
        setHighlightedText(detail.text);
      } else {
        // For backward compatibility
        setHighlightedBlockId(detail);
        setHighlightedText(null);
      }
    };
  
    window.addEventListener("latex-block-click", handler);
    return () => window.removeEventListener("latex-block-click", handler);
  }, []);

  // ✅ Function to sync HTML edits back into LaTeX
  const onSaveSync = (htmlEdits: Record<string, string>) => {
    const updatedLatex = applyHtmlEditsToLatex(latexCode, htmlEdits);
    setLatexCode(updatedLatex);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[var(--dark-bg)] text-[var(--dark-text-primary)] flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="p-4 md:p-6 bg-[var(--dark-card-bg)] border-b border-[var(--primary-dark)] backdrop-blur-sm bg-opacity-80 sticky top-0 z-10"
        variants={itemVariants}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
            Resume Template Editor
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-[var(--dark-section-bg)] p-1 rounded-lg lg:hidden">
              <button
                onClick={() => setIsMobilePanelEditor(true)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  isMobilePanelEditor 
                    ? 'bg-[var(--primary)] text-black font-medium' 
                    : 'text-[var(--dark-text-secondary)]'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setIsMobilePanelEditor(false)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  !isMobilePanelEditor 
                    ? 'bg-[var(--primary)] text-black font-medium' 
                    : 'text-[var(--dark-text-secondary)]'
                }`}
              >
                Preview
              </button>
            </div>
            
            <Button 
              onClick={() => window.history.back()}
              className="bg-transparent hover:bg-[var(--dark-section-bg)] border border-[var(--primary-dark)] text-[var(--dark-text-primary)] text-xs sm:text-sm px-3 py-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Back
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <motion.section 
            className={`lg:w-1/2 ${isMobilePanelEditor ? 'block' : 'hidden'} lg:block`}
            variants={itemVariants}
          >
            <div className="bg-[var(--dark-section-bg)] rounded-xl p-5 h-[calc(100vh-12rem)] shadow-xl">
            <LatexEditor
      latexCode={latexCode}
      setLatexCode={setLatexCode}
      highlightedBlockId={highlightedBlockId}
      highlightedText={highlightedText}
    />    </div>
          </motion.section>

          <motion.section 
            className={`lg:w-1/2 ${!isMobilePanelEditor ? 'block' : 'hidden'} lg:block`}
            variants={itemVariants}
          >
            <div className="bg-[var(--dark-section-bg)] rounded-xl p-5 h-[calc(100vh-12rem)] shadow-xl">
              <PdfPreviewCompiler
                templateId={templateId}
                latexCode={latexCode}
                onSaveSync={onSaveSync}
              />
            </div>
          </motion.section>
        </div>
      </div>
      
      {/* Footer */}
      <motion.footer 
        className="py-4 px-6 bg-[var(--dark-card-bg)] border-t border-[var(--primary-dark)] text-center text-[var(--dark-text-muted)] text-xs"
        variants={itemVariants}
      >
        <div className="container mx-auto">
          <p>
            <span className="text-[var(--primary)]">Tip:</span> Use LaTeX commands like <code className="bg-[var(--dark-section-bg)] px-1 py-0.5 rounded">\textbf{}</code> for bold text and <code className="bg-[var(--dark-section-bg)] px-1 py-0.5 rounded">\textit{}</code> for italics.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default TemplateEditing;