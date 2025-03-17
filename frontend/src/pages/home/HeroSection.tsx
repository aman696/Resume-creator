import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * This section handles:
 *  - Parallax background / glowing blobs
 *  - Scroll-based animations
 *  - Basic CTA button to navigate or “View Examples”
 */
export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect for hero background
  const parallaxOffset = -scrollY * 0.15;

  return (
    <section className="hero relative overflow-hidden py-24 md:py-32">
      <div 
        className="absolute inset-0 bg-[var(--hero-bg-gradient)]"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--primary-glow)] blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--primary-glow)] blur-3xl opacity-60 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[var(--secondary-glow)] blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "3s" }}></div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
              Build Your Resume
            </span> 
            <span className="relative inline-block ml-2">
              <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-light)] bg-clip-text text-transparent">
                with AI
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="var(--primary-dark)" strokeWidth="2" />
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--dark-text-secondary)] mb-8 max-w-3xl mx-auto leading-relaxed">
            Create professional, ATS-friendly resumes in minutes. Our powerful AI
            streamlines the writing process—so you can focus on landing the job.
          </p>
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="primary-button px-8 py-6 text-lg w-full sm:w-auto group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <button
              onClick={() => {
                // Smooth scroll to the #templates section
                document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent transition-all hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)]"
            >
              View Examples 
            </button>
          </div>
          <p className="text-sm text-[var(--dark-text-muted)]">
            Want advanced AI features? Use your own Mistral API key.{' '}
            <a
              href="/mistral"
              className="text-[var(--primary)] underline hover:text-[var(--primary-light)] transition-colors inline-flex items-center group"
            >
              Set it up here
              <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </p>
        </motion.div>
      </div>

      {/* Floating UI Elements (decorations) */}
      <div className="hidden md:block">
        <motion.div 
          className="absolute top-32 left-32 w-20 h-20 rotate-12"
          animate={{ y: [0, -10, 0], rotate: [12, 5, 12] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <img src="/placeholder.svg?height=80&width=80&text=📄" alt="Document" className="w-full h-full object-contain" />
        </motion.div>

        <motion.div 
          className="absolute bottom-32 right-32 w-24 h-24 -rotate-6"
          animate={{ y: [0, 15, 0], rotate: [-6, -15, -6] }}
          transition={{ repeat: Infinity, duration: 6, delay: 0.5, ease: "easeInOut" }}
        >
          <img src="/placeholder.svg?height=96&width=96&text=💼" alt="Briefcase" className="w-full h-full object-contain" />
        </motion.div>
      </div>
    </section>
  );
}
