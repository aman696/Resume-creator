import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-[var(--hero-bg-gradient)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--primary-glow)] blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[var(--secondary-glow)] blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto rounded-2xl border-2 border-[var(--primary-dark)] bg-[var(--dark-card-bg)] p-10 md:p-14 text-center backdrop-blur-sm"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--primary)]">
            Ready to Create Your Professional Resume?
          </h2>
          <p className="text-[var(--dark-text-secondary)] mb-10 leading-relaxed text-lg">
            Join thousands of job seekers who have successfully landed interviews using Resgen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="primary-button px-10 py-7 text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center font-bold">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-[var(--dark-text-muted)]">
            No credit card required. Start building your resume for free.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
