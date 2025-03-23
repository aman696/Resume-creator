import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom'; // Updated import
import { templates } from './data';

export default function TemplatesSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate(); // Updated hook

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (previewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [previewOpen]);

  // Helper function to extract the template number from the file name
  const getTemplateId = (file: string): string | null => {
    const match = file.match(/\d+/);
    return match ? match[0] : null;
  };

  return (
    <section id="templates" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
              Professional Templates
            </span>
          </h2>
          <p className="text-[var(--dark-text-secondary)] max-w-2xl mx-auto leading-relaxed text-lg">
            Get a head start with our pre-built layouts—optimized for recruiters and Applicant Tracking Systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className="relative w-full h-[350px] overflow-hidden group"
                onMouseEnter={() => setHoveredTemplate(index)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                {/* Overlay when hovered */}
                <div
                  className={cn(
                    'absolute inset-0 h-[400px] bg-[var(--dark-card-bg)] bg-opacity-90 transition-opacity',
                    hoveredTemplate === index ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <div className="flex flex-col items-center gap-4 p-6 text-center">
                    <motion.div
                      className="rounded-full bg-[var(--primary-glow)] p-3"
                      animate={hoveredTemplate === index ? { scale: [0.8, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="h-8 w-8 text-[var(--primary)]" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[var(--dark-text-primary)]">
                      {template.name}
                    </h3>
                    <p className="text-[var(--dark-text-muted)] mb-4">
                      Professional and ATS-optimized layout
                    </p>
                    <div className="flex gap-4">
                    <Button
  className="primary-button px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm w-full sm:w-auto"
  onClick={async () => {
    // Extract the template ID from the file name (e.g., "template1.pdf" -> "1")
    const templateId = getTemplateId(template.file as string);
    if (templateId) {
      try {
        // Use the full URL to hit the FastAPI endpoint
        const res = await fetch(`http://localhost:8000/templates/${templateId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch template LaTeX code");
        }
        const data = await res.json();
        // Navigate to the editing page, passing both the PDF file and the LaTeX code
        navigate('/edit-template', { state: { templateFile: template.file,templateId, latex: data.content } });
      } catch (error) {
        console.error("Error fetching LaTeX code: ", error);
      }
    } else {
      console.error("Template ID not found in the file name");
    }
  }}
>
  Use Template
</Button>

                      <Button
                        className="primary-button px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm w-full sm:w-auto z-10"
                        onClick={() => {
                          setSelectedTemplate(template.file);
                          setPreviewOpen(true);
                        }}
                      >
                        Preview Template
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Embedded PDF preview */}
                <iframe
                  src={`${template.file}#toolbar=0&zoom=35&scrollbar=0&navpanes=0`}
                  className="w-full h-[400px] object-contain"
                  style={{
                    border: 'none',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                  }}
                  scrolling="no"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            className="px-4 py-2 rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent transition-all hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)]"
          >
            View All Templates
          </button>
        </motion.div>
      </div>

      {/* Modal for PDF Preview */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={() => setPreviewOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl bg-gradient-to-b from-[var(--dark-card-bg)] to-[var(--dark-bg)] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-[var(--primary-dark)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[var(--primary-dark)] bg-[var(--dark-bg)]">
              <div className="flex items-center">
                <div className="w-1 sm:w-1.5 h-5 sm:h-6 bg-[var(--primary)] rounded-full mr-2 sm:mr-3 shadow-[0_0_10px_var(--primary-glow)]" />
                <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                  Template Preview
                </h3>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="group bg-[var(--dark-bg)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300 border border-[var(--primary-dark)] hover:border-transparent hover:shadow-[0_0_15px_var(--primary-glow)]"
                aria-label="Close preview"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-90 transition-transform" />
              </button>
            </div>
            
            {/* Modal content */}
            <div className="flex-1 bg-[var(--dark-bg)] p-3 sm:p-4 md:p-6 flex items-center justify-center">
              <div className="relative w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] max-h-[50vh] sm:max-h-[60vh] md:max-h-[75vh]">
                <div
                  className="absolute inset-0 flex items-center justify-center bg-[var(--dark-bg)] bg-opacity-70 pointer-events-none z-10"
                  id="pdf-loading-overlay"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 sm:border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                </div>

                <object
                  data={`${selectedTemplate}#zoom=50&toolbar=0&scrollbar=0&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-[50vh] sm:h-[60vh] md:h-[75vh] overflow-hidden bg-[var(--dark-bg)]"
                  style={{ border: 'none', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                  onLoad={() => {
                    const overlay = document.getElementById('pdf-loading-overlay');
                    if (overlay) overlay.style.display = 'none';
                  }}
                >
                  <p className="text-[var(--dark-text-secondary)]">Your browser does not support PDF viewing.</p>
                </object>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-3 sm:p-4 border-t border-[var(--primary-dark)] flex justify-end space-x-2 sm:space-x-4 bg-[var(--dark-bg)]">
              <button
                className="px-3 sm:px-4 py-2 rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent transition-all hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)] text-sm sm:text-base"
              >
                Use this template
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
