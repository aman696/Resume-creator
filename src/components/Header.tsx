
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would toggle the theme
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[var(--dark-bg)] border-b border-[var(--primary-dark)]">
      <div className="container mx-auto px-4 md:px-8 h-[var(--header-height)] flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[var(--primary)]">Resgen</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <ul className="flex items-center space-x-1">
            <li>
              <a
                href="#features"
                className="px-4 py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#templates"
                className="px-4 py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Templates
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-4 py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-4 py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Blog
              </a>
            </li>
          </ul>

          <div className="flex items-center pl-4 space-x-3">
            <Button variant="outline" size="sm" className="border-[var(--primary-dark)] text-[var(--dark-text-secondary)]">
              Sign In
            </Button>
            <Button size="sm" className="primary-button">
              Sign Up
            </Button>
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full bg-[var(--dark-card-bg)] text-[var(--primary)] hover:bg-[var(--dark-section-bg)] transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 mr-2 rounded-full bg-[var(--dark-card-bg)] text-[var(--primary)]"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-[var(--dark-card-bg)] text-[var(--primary)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--dark-bg)] border-b border-[var(--primary-dark)]">
          <div className="container mx-auto px-4 py-4">
            <nav>
              <ul className="flex flex-col space-y-4">
                <li>
                  <a
                    href="#features"
                    className="block py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#templates"
                    className="block py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 text-[var(--dark-text-secondary)] hover:text-[var(--primary)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </a>
                </li>
                <div className="pt-4 flex flex-col space-y-3">
                  <Button variant="outline" className="border-[var(--primary-dark)] text-[var(--dark-text-secondary)]">
                    Sign In
                  </Button>
                  <Button className="primary-button">
                    Sign Up
                  </Button>
                </div>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
