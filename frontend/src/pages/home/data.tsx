import React from 'react';
import { Sparkles, FileText, Download } from 'lucide-react';
// PDF imports
import template1 from '../../assets/template1.pdf';
import template2 from '../../assets/template2.pdf';
import template3 from '../../assets/template3.pdf';

export const features = [
    {
      title: "AI-Assisted Writing",
      description: "Tailor your resume for each application with automatically suggested bullet points and phrasing.",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      title: "Customizable Templates",
      description: "Browse ATS-friendly templates designed by HR pros, then adjust fonts, colors, and layouts.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "One-Click Downloads",
      description: "Export your resume as PDF, Word, or Text—ready to send to employers instantly.",
      icon: <Download className="h-5 w-5" />,
    },
  ];

export const templates = [
  { id: 1, name: "Professional", file: template1 },
  { id: 2, name: "Creative", file: template2 },
  { id: 3, name: "Minimalist", file: template3 },
];

