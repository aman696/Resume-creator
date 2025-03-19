"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { Maximize, X, Download } from "lucide-react"

interface PdfPreviewCompilerProps {
  latexCode: string
}

const PdfPreviewCompiler: React.FC<PdfPreviewCompilerProps> = ({ latexCode }) => {
  const [pdfData, setPdfData] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isInitialCompile, setIsInitialCompile] = useState(true)

  const compileLatex = async (code: string, showMessages = true) => {
    // Only clear messages if we're showing them
    if (showMessages) {
      setErrorMessage(null)
      setSuccessMessage(null)
    }
    
    // Safety check to prevent compilation of empty code
    if (!code.trim()) {
      if (showMessages) {
        setErrorMessage("Cannot compile empty LaTeX code")
      }
      return
    }

    setIsCompiling(true)

    try {
      const response = await axios.post(
        "http://localhost:8000/compiler/compile",
        { latex_code: code },
        { responseType: "blob" },
      )

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
      const reader = new FileReader()
      
      reader.onload = () => {
        const base64data = reader.result as string
        setPdfData(base64data)
        if (showMessages) {
          setSuccessMessage("PDF compiled successfully!")
        }
      }
      
      reader.onerror = () => {
        if (showMessages) {
          setErrorMessage("Failed to read the compiled PDF")
        }
      }
      
      reader.readAsDataURL(pdfBlob)
    } catch (error: any) {
      console.error("Compilation error:", error)
      if (showMessages) {
        setErrorMessage(error.response?.data?.detail || error.message || "Unknown error occurred")
      }
    } finally {
      setIsCompiling(false)
    }
  }

  // Auto-compile on initial load
  useEffect(() => {
    if (latexCode.trim() && isInitialCompile) {
      compileLatex(latexCode, false); // Don't show messages for initial compile
      setIsInitialCompile(false);
    }
  }, [latexCode, isInitialCompile]);

  const handleCompile = () => {
    compileLatex(latexCode, true); // Show messages for manual compile
  }
  const handleDownload = () => {
    if (!pdfData) {
      setErrorMessage("Compile the PDF first.")
      return
    }
    const link = document.createElement("a")
    link.href = pdfData
    link.download = "compiled_resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      className="flex flex-col h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap">
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
              <path d="M12 3v12"></path>
              <path d="m8 11 4 4 4-4"></path>
              <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
            </svg>
          </span>
          Preview &amp; Download
        </h2>
      </div>

      {/* Status Messages */}
      {errorMessage && (
        <div className="mb-4 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-200 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Compile/Download Buttons */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Button
          onClick={handleCompile}
          disabled={isCompiling}
          className="primary-button px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm sm:w-auto z-10 flex-shrink-0"
        >
          {isCompiling ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Compiling...
            </span>
          ) : (
            "Compile"
          )}
        </Button>
        <button
          onClick={handleDownload}
          disabled={!pdfData}
          className="px-4 py-2 rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent transition-all hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)] sm:w-auto z-10 flex-shrink-0"
        >
          Download PDF
        </button>
      </div>

      {/* PDF Live Preview with Enlarge Button */}
      <div className="relative flex-1 group min-h-[250px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--secondary-dark)] to-[var(--primary-dark)] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative h-full rounded-lg overflow-hidden bg-[var(--dark-card-bg)] border border-[var(--primary-dark)]">
          {pdfData ? (
            <>
              <iframe
                title="PDF Preview"
                src={`${pdfData}#toolbar=0`}
                className="w-full h-full"
                style={{ background: "white" }}
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-3 right-3 p-2 bg-[var(--secondary)] text-[var(--dark-bg)] rounded-full transition-all hover:shadow-[0_0_10px_var(--secondary-glow)] z-20 flex items-center justify-center"
                aria-label="Enlarge PDF"
              >
                <Maximize size={18} />
              </button>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-4 text-[var(--dark-text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-[var(--dark-text-secondary)] mb-2">No PDF to display yet</p>
              <p className="text-sm text-[var(--dark-text-muted)]">
                Click "Compile" to generate a preview of your LaTeX document
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal for Enlarged PDF View */}
      <AnimatePresence>
        {isModalOpen && pdfData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Close the modal when clicking the backdrop, but not the content
              if (e.target === e.currentTarget) {
                setIsModalOpen(false)
              }
            }}
          >
            <motion.div
              className="relative w-[95%] md:w-[85%] h-[90%] md:h-[98%] bg-white rounded-lg overflow-hidden shadow-[0_0_25px_var(--primary-glow)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Toolbar for fullscreen view */}
              <div className="absolute top-0 left-0 right-0 flex justify-between items-center py-2 px-4 bg-[var(--dark-card-bg)] border-b border-[var(--primary-dark)] z-10">
                <h3 className="text-[var(--primary)] font-semibold text-sm md:text-base">PDF Preview</h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-full text-[var(--secondary)] hover:bg-[var(--secondary-dark)]/10 transition-colors"
                    aria-label="Download PDF"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* PDF Viewer with padding to account for the toolbar */}
              <div className="w-full h-full pt-10 flex items-center justify-center">
                <iframe
                  title="PDF Fullscreen Preview"
                  src={`${pdfData}#toolbar=0&view=FitV`}
                  className="w-full h-full"
                  style={{ maxHeight: "calc(100vh - 3rem)" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PdfPreviewCompiler
