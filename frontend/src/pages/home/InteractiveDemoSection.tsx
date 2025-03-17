import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, MousePointer } from 'lucide-react';

export default function InteractiveDemoSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-[var(--dark-section-bg)]"></div>
      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-6xl">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left column */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-[var(--primary)]">
                See How It Works
              </h2>
              <p className="text-[var(--dark-text-secondary)] leading-relaxed mb-6">
                Our intuitive interface makes building professional resumes simple, even if you've never created one before.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 h-6 w-6 text-[var(--secondary)]">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="text-[var(--dark-text-muted)]">
                    Intelligent suggestions based on job descriptions
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 h-6 w-6 text-[var(--secondary)]">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="text-[var(--dark-text-muted)]">
                    Real-time ATS compatibility scoring
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 h-6 w-6 text-[var(--secondary)]">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="text-[var(--dark-text-muted)]">
                    Interactive drag-and-drop editor
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button className="primary-button flex items-center px-6 py-3">
                  Try The Demo
                  <MousePointer className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right column / image */}
          <div className="lg:col-span-3 relative">
            <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden rounded-2xl border-2 border-[var(--primary-dark)] shadow-xl">
              {/* Fake "browser" top bar */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-[var(--dark-bg)] flex items-center px-4 border-b border-[var(--primary-dark)]">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--error)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--warning)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                </div>
                <div className="mx-auto text-sm text-[var(--dark-text-muted)]">
                  Resume Builder
                </div>
              </div>
              {/* The "screenshot" */}
              <div className="pt-10 h-full bg-[var(--dark-card-bg)]">
                <img
                  src="/placeholder.svg?height=600&width=450&text=Resume+Builder+Interface"
                  alt="Resume Builder Interface"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Animated sparkles */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
