import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, FileText, Download } from 'lucide-react';
import { features } from './data'; // optional if you place your data in data.ts

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28">
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
              Powerful Features
            </span>
          </h2>
          <p className="text-[var(--dark-text-secondary)] max-w-2xl mx-auto leading-relaxed text-lg">
            Discover how Resgen can help you create standout resumes tailored
            to each job application.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="feature-card h-full p-8 rounded-[var(--border-radius)] border-l-4 border-l-[var(--primary)] border transition-all duration-300 hover:shadow-[var(--feature-card-hover-shadow)] bg-[var(--dark-card-bg)] hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary-glow)] text-[var(--primary)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-[var(--primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--dark-text-muted)] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
