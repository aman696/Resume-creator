'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For React Router (or use Next.js useRouter)
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TemplateEditing = () => {
  // State to hold the LaTeX code
  const [latexCode, setLatexCode] = useState<string>(''); // Will be populated with the selected template
  const [pdfUrl, setPdfUrl] = useState<string>(''); // URL of the rendered PDF

  // Get the template file from the navigation (e.g., passed via router)
  const location = useLocation(); // For React Router
  const { state } = location;
  const templateFile = state?.templateFile; // Assuming the template file URL is passed

  // Load the LaTeX code of the selected template (for now, we'll hardcode or fetch it later)
  useEffect(() => {
    // For now, let's hardcode the LaTeX code of one of the templates
    // In a real app, you'd fetch this from the back-end or a file
    const sampleLatex = `
\\documentclass[11pt,a4paper]{article}
\\usepackage[left=0.5in,top=0.5in,right=0.5in,bottom=0.5in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{tabularx}
\\usepackage{fontawesome5}

\\definecolor{sidebarcolor}{RGB}{240,248,255}
\\definecolor{headingcolor}{RGB}{70,130,180}

\\titleformat{\\section}{\\large\\bfseries\\color{headingcolor}}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{*1.5}{*0.5}

\\titleformat{\\subsection}{\\bfseries}{}{0em}{}
\\titlespacing*{\\subsection}{0pt}{*1}{*0.25}

\\pagenumbering{gobble}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=1.5em, itemsep=0.2em, parsep=0pt}

\\begin{document}

\\begin{tabularx}{\\linewidth}{@{}p{0.3\\textwidth}|X@{}}
    \\hline
    \\multicolumn{1}{|p{0.3\\textwidth}|}{\\cellcolor{sidebarcolor}
    \\vspace{0.5em}
    {\\huge\\bfseries\\color{headingcolor} RICHARD WILLIAMS} \\\\[0.5em]
    \\faEnvelope \\ \\href{mailto:RichardWilliams@gmail.com}{RichardWilliams@gmail.com} \\\\
    \\faPhone \\ (770) 625-9669 \\\\
    \\faMapMarkerAlt \\ 3665 Margaret Street, Houston, TX 47587 \\\\[1em]
    
    \\section*{Skills}
    \\begin{itemize}
        \\item MS Office (Word, Excel, PowerPoint)
        \\item Outlook, Salesforce, TPS Project Management
        \\item Fluent in English, Spanish, French
    \\end{itemize}
    \\vspace{1em}
    } &
    
    \\vspace{0.5em}
    \\section*{Profile}
    Financial Advisor with 7+ years of experience delivering financial and investment advisory services to high-value clients. Proven success in managing multi-million dollar portfolios, driving profitability, and increasing ROI through strategic planning, consulting, and advisory expertise. \\\\[0.5em]
    
    \\section*{Professional Experience}
    
    \\subsection*{Senior Financial Advisor}
    \\textbf{Wells Fargo Advisors} -- Houston, TX \\\\
    \\textit{August 2020 -- Present}
    \\begin{itemize}
        \\item Deliver financial advice to clients on investments, insurance, business, and estate planning with minimal risk.
        \\item Manage investment portfolios for 300+ high-value clients, overseeing \\$190M in AUM.
        \\item Boosted client satisfaction ratings from 88\\% to 99.9\\% in under 6 months through personalized service.
        \\item Collaborate with specialists across branches to manage \\$25M+ in assets for 800+ clients.
    \\end{itemize}
    
    \\subsection*{Financial Advisor}
    \\textbf{SunTrust Investment Services, Inc.} -- New Orleans, LA \\\\
    \\textit{July 2017 -- August 2020}
    \\begin{itemize}
        \\item Managed a \\$20.75M investment portfolio for 90+ individual and corporate clients.
        \\item Implemented a training program that elevated regional productivity ranking from \\#10 to \\#3 in under 2 years.
        \\item Increased AUM by 50\\% through cross-functional asset management and risk mitigation strategies.
    \\end{itemize}
    
    \\subsection*{Financial Advisor}
    \\textbf{Maverick Capital Management} -- New Orleans, LA \\\\
    \\textit{July 2014 -- August 2017}
    \\begin{itemize}
        \\item Primary contact for 15+ clients, managing portfolios totaling \\$8.5M in assets.
    \\end{itemize}
    
    \\section*{Education}
    \\textbf{Louisiana State University} -- Baton Rouge, LA \\\\
    \\textit{May 2014} \\\\
    Bachelor of Science in Business Administration (Finance) \\\\
    Honors: Cum Laude (GPA: 3.7/4.0)
    
\\end{tabularx}

\\end{document}
    `;
    setLatexCode(sampleLatex);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-[var(--dark-text-primary)] flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6 bg-[var(--dark-card-bg)] border-b border-[var(--primary-dark)] flex justify-between items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--primary)]">
          Edit Template
        </h1>
        <Button
          className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)]"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </header>

      {/* Split Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Left Side: LaTeX Editor */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 bg-[var(--dark-bg)] border-r border-[var(--primary-dark)]">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[var(--primary)] mb-2 sm:mb-4">
            LaTeX Code
          </h2>
          <textarea
            className="w-full h-[calc(100%-40px)] sm:h-[calc(100%-48px)] p-2 sm:p-3 bg-[var(--dark-card-bg)] text-[var(--dark-text-primary)] border border-[var(--primary-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm sm:text-base"
            value={latexCode}
            onChange={(e) => setLatexCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Right Side: PDF Preview */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 bg-[var(--dark-bg)] flex flex-col">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[var(--primary)] mb-2 sm:mb-4">
            Resume Preview
          </h2>
          <div className="flex-1 relative w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Placeholder for PDF (will be updated by back-end) */}
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--dark-bg)] bg-opacity-70 pointer-events-none">
              <div className="w-6 sm:w-10 h-6 sm:h-10 border-2 sm:border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <object
              data={pdfUrl || templateFile} // Fallback to templateFile if pdfUrl isn't set
              type="application/pdf"
              className="w-full h-full overflow-hidden bg-[var(--dark-bg)]"
              style={{ 
                border: 'none',
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
              }}
            >
              <p className="text-[var(--dark-text-secondary)] text-sm sm:text-base p-4">
                PDF rendering is not supported. Please compile the LaTeX code to see the preview.
              </p>
            </object>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditing;