'use client';

import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import InteractiveDemoSection from './InteractiveDemoSection';
import TemplatesSection from './TemplatesSection';
import CtaSection from './CtaSection';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-[var(--dark-bg)] text-[var(--dark-text-primary)] pb-12 overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <InteractiveDemoSection />
      <TemplatesSection />
      <CtaSection />
    </main>
  );
}
