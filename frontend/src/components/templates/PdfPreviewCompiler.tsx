"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Maximize, X, Download, Edit, Save } from "lucide-react";
import template1 from "../../assets/template1.html";
import template2 from "../../assets/template2.html";
import template3 from "../../assets/template3.html";

interface TemplatePreviewProps {
  latexCode: string; // kept for backward compatibility; not used now
  templateId: number;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ latexCode, templateId }) => {
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const mainIframeRef = useRef<HTMLIFrameElement>(null);
  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const originalHtmlRef = useRef<string | null>(null);

  // Utility: create a blob URL for the updated HTML
  const createBlobUrl = (html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    return URL.createObjectURL(blob);
  };

  // Load the template HTML
  const loadTemplate = async (showMessages = true) => {
    if (showMessages) {
      setErrorMsg(null);
      setSuccessMsg(null);
    }
    setIsLoading(true);
    try {
      let selectedTemplate: string | null = null;
      const id = Number(templateId);
      console.log("Template ID:", id);
      if (id === 1) {
        selectedTemplate = template1;
      } else if (id === 2) {
        selectedTemplate = template2;
      } else if (id === 3) {
        selectedTemplate = template3;
      } else {
        if (showMessages) setErrorMsg("Invalid template selection.");
        return;
      }

      // Always fetch the original template
      fetch(selectedTemplate)
        .then((response) => response.text())
        .then((html) => {
          originalHtmlRef.current = html;
          setHtmlContent(html);
          setTemplateUrl(createBlobUrl(html));
          if (showMessages) setSuccessMsg("Template loaded successfully!");
        })
        .catch((error) => {
          console.error("Error fetching template HTML:", error);
          if (showMessages) setErrorMsg("Error loading template content");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error: any) {
      console.error("Template selection error:", error);
      if (showMessages) {
        setErrorMsg(error.message || "Unknown error occurred");
      }
      setIsLoading(false);
    }
  };

  // On mount or when templateId changes, load once
  useEffect(() => {
    if (templateId && initialLoad) {
      loadTemplate(false);
      setInitialLoad(false);
    }
    return () => {
      // Cleanup any blob URLs
      if (templateUrl && templateUrl.startsWith("blob:")) {
        URL.revokeObjectURL(templateUrl);
      }
    };
  }, [templateId, initialLoad]);

  // Make text nodes contentEditable or not
  const makeContentEditable = (iframeDoc: Document | null, editable: boolean) => {
    if (!iframeDoc) return;

    // Attach a click listener for logging data-latex-id
    attachDataIdClickListeners(iframeDoc);

    // Turn each text node's parent element into contentEditable if desired
    const walker = iframeDoc.createTreeWalker(
      iframeDoc.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (
            node.parentElement &&
            (node.parentElement.tagName === "SCRIPT" ||
              node.parentElement.tagName === "STYLE")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.textContent && node.textContent.trim() !== ""
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      }
    );

    const textElements: HTMLElement[] = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.parentElement && !textElements.includes(currentNode.parentElement)) {
        textElements.push(currentNode.parentElement);
      }
    }

    textElements.forEach((element) => {
      element.contentEditable = editable ? "true" : "false";
      if (editable) {
        element.style.outline = "1px dashed #007bff";
        element.style.padding = "2px";
        element.addEventListener("focus", () => {
          element.style.outline = "2px solid #007bff";
          element.style.backgroundColor = "rgba(0, 123, 255, 0.1)";
        });
        element.addEventListener("blur", () => {
          element.style.outline = "1px dashed #007bff";
          element.style.backgroundColor = "";
        });
      } else {
        element.style.outline = "";
        element.style.padding = "";
        element.style.backgroundColor = "";
      }
    });
  };

  // Attach click listeners to all data-latex-id elements to log them
  const attachDataIdClickListeners = (iframeDoc: Document) => {
    const dataElements = iframeDoc.querySelectorAll("[data-latex-id]");
    dataElements.forEach((el) => {
      el.removeEventListener("click", onDataIdClick); // to avoid duplicates
      el.addEventListener("click", onDataIdClick);
    });
  };

  // Handler that logs the data-latex-id
  const onDataIdClick = (ev: Event) => {
    ev.stopPropagation(); // prevent deeper event handling
    const target = ev.currentTarget as HTMLElement;
    const dataId = target.getAttribute("data-latex-id");
    if (dataId) {
      console.log("Clicked data-latex-id:", dataId);
    }
  };

  // Apply or remove edit mode
  const applyEditMode = (editable: boolean) => {
    if (mainIframeRef.current?.contentDocument) {
      makeContentEditable(mainIframeRef.current.contentDocument, editable);
    }
    if (modalOpen && modalIframeRef.current?.contentDocument) {
      makeContentEditable(modalIframeRef.current.contentDocument, editable);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      saveChanges();
      setIsEditing(false);
      applyEditMode(false);
      setSuccessMsg("Changes saved successfully!");
    } else {
      setIsEditing(true);
      applyEditMode(true);
      setSuccessMsg("Edit mode activated. Click on text to modify it.");
    }
  };

  // Save changes from whichever iframe is in use
  const saveChanges = () => {
    let doc: Document | null = null;
    if (modalOpen && modalIframeRef.current?.contentDocument) {
      doc = modalIframeRef.current.contentDocument;
    } else if (mainIframeRef.current?.contentDocument) {
      doc = mainIframeRef.current.contentDocument;
    }
    if (!doc) {
      setErrorMsg("Cannot save changes. Document not available.");
      return;
    }
    // Remove contentEditable from all elements
    const editableElements = doc.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach((el) => {
      (el as HTMLElement).contentEditable = "false";
      (el as HTMLElement).style.outline = "";
      (el as HTMLElement).style.padding = "";
      (el as HTMLElement).style.backgroundColor = "";
    });

    // Extract new HTML
    const newHtml = "<!DOCTYPE html>" + doc.documentElement.outerHTML;
    setHtmlContent(newHtml);

    // Rebuild the blob URL
    if (templateUrl && templateUrl.startsWith("blob:")) {
      URL.revokeObjectURL(templateUrl);
    }
    const newUrl = createBlobUrl(newHtml);
    setTemplateUrl(newUrl);

    // Reload frames
    if (mainIframeRef.current) {
      mainIframeRef.current.src = newUrl;
    }
    if (modalIframeRef.current) {
      modalIframeRef.current.src = newUrl;
    }
  };

  // Called after the iframe loads
  const handleIframeLoad = (isModal: boolean) => {
    if (isEditing) {
      if (isModal && modalIframeRef.current) {
        makeContentEditable(modalIframeRef.current.contentDocument, true);
      } else if (!isModal && mainIframeRef.current) {
        makeContentEditable(mainIframeRef.current.contentDocument, true);
      }
    } else {
      // Even if not editing, attach click listeners so we can log data-latex-id
      const doc = isModal
        ? modalIframeRef.current?.contentDocument
        : mainIframeRef.current?.contentDocument;
      if (doc) {
        attachDataIdClickListeners(doc);
      }
    }
  };

  // Download the updated HTML
  const handleDownload = () => {
    if (!htmlContent) {
      setErrorMsg("Load the template first.");
      return;
    }
    if (isEditing) {
      saveChanges();
    }
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume_template.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="flex flex-col h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header + Buttons */}
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
              <path d="M12 3v12" />
              <path d="m8 11 4 4 4-4" />
              <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
            </svg>
          </span>
          Preview &amp; Download
        </h2>
      </div>

      {/* Error / Success Messages */}
      {errorMsg && (
        <div className="mb-4 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-200 rounded-md">
          {successMsg}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Button
          onClick={() => loadTemplate(true)}
          disabled={isLoading}
          className="primary-button px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm sm:w-auto z-10 flex-shrink-0"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading Template...
            </span>
          ) : (
            "Load Template"
          )}
        </Button>
        <Button
          onClick={toggleEditMode}
          disabled={!templateUrl}
          className={`px-4 py-2 rounded border ${isEditing ? "bg-green-600 text-white border-green-500" : "border-[var(--secondary)] text-[var(--secondary)] bg-transparent"} transition-all hover:shadow-[0_0_10px_var(--secondary-glow)] sm:w-auto z-10 flex-shrink-0 flex items-center gap-2`}
        >
          {isEditing ? <Save size={16} /> : <Edit size={16} />}
          {isEditing ? "Save Changes" : "Edit Text"}
        </Button>
        <button
          onClick={handleDownload}
          disabled={!templateUrl}
          className="px-4 py-2 rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent transition-all hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)] sm:w-auto z-10 flex-shrink-0"
        >
          Download HTML
        </button>
      </div>

      {/* Main Iframe Preview */}
      <div className="relative flex-1 group min-h-[250px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--secondary-dark)] to-[var(--primary-dark)] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative h-full rounded-lg overflow-hidden bg-[var(--dark-card-bg)] border border-[var(--primary-dark)]">
          {templateUrl ? (
            <>
              <iframe
                ref={mainIframeRef}
                title="HTML Template Preview"
                src={templateUrl}
                className="w-full h-full"
                style={{ background: "white" }}
                onLoad={() => handleIframeLoad(false)}
              />
              {!isEditing && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="absolute top-3 right-3 p-2 bg-[var(--secondary)] text-[var(--dark-bg)] rounded-full transition-all hover:shadow-[0_0_10px_var(--secondary-glow)] z-20 flex items-center justify-center"
                  aria-label="Enlarge HTML Preview"
                >
                  <Maximize size={18} />
                </button>
              )}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[var(--dark-text-secondary)] mb-2">No template loaded yet</p>
              <p className="text-sm text-[var(--dark-text-muted)]">
                Click "Load Template" to generate a preview.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for fullscreen */}
      <AnimatePresence>
        {modalOpen && templateUrl && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              className="relative w-[95%] md:w-[85%] h-[90%] md:h-[98%] bg-white rounded-lg overflow-hidden shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 flex justify-between items-center py-2 px-4 bg-[var(--dark-card-bg)] border-b border-[var(--primary-dark)]">
                <h3 className="text-[var(--primary)] font-semibold text-sm md:text-base">
                  HTML Template Preview
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={toggleEditMode}
                    disabled={!templateUrl}
                    className={`p-2 rounded-full ${isEditing ? "text-green-500" : "text-[var(--primary)]"} hover:bg-[var(--primary-dark)]/10 transition-colors`}
                    aria-label={isEditing ? "Save Changes" : "Edit Text"}
                  >
                    {isEditing ? <Save size={20} /> : <Edit size={20} />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-full text-[var(--secondary)] hover:bg-[var(--secondary-dark)]/10 transition-colors"
                    aria-label="Download HTML"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        // Save changes on close
                        saveChanges();
                      }
                      setModalOpen(false);
                    }}
                    className="p-2 rounded-full text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="w-full h-full pt-10 flex items-center justify-center">
                <iframe
                  ref={modalIframeRef}
                  title="HTML Fullscreen Preview"
                  src={templateUrl}
                  className="w-full h-full"
                  style={{ maxHeight: "calc(100vh - 3rem)" }}
                  onLoad={() => handleIframeLoad(true)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TemplatePreview;
