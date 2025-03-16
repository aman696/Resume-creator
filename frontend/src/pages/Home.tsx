
'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Download, FileText, Sparkles, MousePointer, Star, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Home() {
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
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

  const templates = [
    { id: 1, name: "Professional", tag: "Most Popular" },
    { id: 2, name: "Creative", tag: "Designer's Choice" },
    { id: 3, name: "Minimalist", tag: "Clean & Simple" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Solutions Inc.",
      quote: "Using Resgen's AI tools, I was able to tailor my resume for each application. I received interview requests from 80% of the companies I applied to and landed my dream job!",
      stars: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Innovate Labs",
      quote: "Resgen's templates made my resume stand out. I got multiple interview calls within a week of applying!",
      stars: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
    },
  ];

  const statsData = [
    { value: "89%", label: "Interview Rate" },
    { value: "3.2M+", label: "Resumes Created" },
    { value: "4.9", label: "Average Rating" },
  ];

  // Parallax effect for hero background
  const parallaxOffset = -scrollY * 0.15;

  return (
    <main className="min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-[var(--dark-bg)] text-[var(--dark-text-primary)] pb-12 overflow-hidden">
      {/* Hero Section */}
      <section className="hero relative overflow-hidden py-24 md:py-32">
        <div 
          className="absolute inset-0 bg-[var(--hero-bg-gradient)]"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        ></div>
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
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">Build Your Resume</span> 
              <span className="relative inline-block ml-2">
                <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-light)] bg-clip-text text-transparent">with AI</span>
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
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>

        <button
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

        {/* Floating UI Elements */}
        <div className="hidden md:block">
          <motion.div 
            className="absolute top-32 left-32 w-20 h-20 rotate-12"
            animate={{ 
              y: [0, -10, 0], 
              rotate: [12, 5, 12],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut"
            }}
          >
            <img src="/placeholder.svg?height=80&width=80&text=📄" alt="Document" className="w-full h-full object-contain" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-32 right-32 w-24 h-24 -rotate-6"
            animate={{ 
              y: [0, 15, 0], 
              rotate: [-6, -15, -6],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              delay: 0.5,
              ease: "easeInOut"
            }}
          >
            <img src="/placeholder.svg?height=96&width=96&text=💼" alt="Briefcase" className="w-full h-full object-contain" />
          </motion.div>
        </div>
      </section>



      {/* Features Section */}
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

      {/* Interactive Demo Section */}
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
                  <Button
                    className="primary-button flex items-center px-6 py-3"
                  >
                    Try The Demo
                    <MousePointer className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 relative">
              <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden rounded-2xl border-2 border-[var(--primary-dark)] shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-10 bg-[var(--dark-bg)] flex items-center px-4 border-b border-[var(--primary-dark)]">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--error)]"></div>
                    <div className="w-3 h-3 rounded-full bg-[var(--warning)]"></div>
                    <div className="w-3 h-3 rounded-full bg-[var(--success)]"></div>
                  </div>
                  <div className="mx-auto text-sm text-[var(--dark-text-muted)]">
                    Resume Builder
                  </div>
                </div>
                <div className="pt-10 h-full bg-[var(--dark-card-bg)]">
                  <img 
                    src="/placeholder.svg?height=600&width=450&text=Resume+Builder+Interface" 
                    alt="Resume Builder Interface" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates Section */}
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
              Get a head start with our pre-built layouts—optimized for
              recruiters and Applicant Tracking Systems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="relative w-full h-[400px] overflow-hidden rounded-[var(--border-radius)] border-2 border-[var(--primary-dark)] transition-all duration-300 hover:shadow-[var(--feature-card-hover-shadow)] group"
                  onMouseEnter={() => setHoveredTemplate(index)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  {template.tag && (
                    <div className="absolute top-4 right-4 z-20 bg-[var(--secondary)] text-[var(--dark-bg)] text-xs font-bold px-3 py-1 rounded-full">
                      {template.tag}
                    </div>
                  )}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[var(--dark-card-bg)]/95 via-[var(--dark-card-bg)]/70 to-transparent opacity-0 transition-opacity duration-300",
                      hoveredTemplate === index && "opacity-100"
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
                      <Button className="primary-button px-6 py-3">
                        Use Template
                      </Button>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[var(--primary-glow)]/5"></div>
                  <img
                    src={`/placeholder.svg?height=600&width=450&text=Template+${template.id}`}
                    alt={`Resume Template ${template.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <Button
              className="secondary-button px-8 py-3 text-lg"
            >
              View All Templates
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
            </div>
            <p className="mt-6 text-sm text-[var(--dark-text-muted)]">
              No credit card required. Start building your resume for free.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
