import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "/logo.png";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[var(--dark-bg)] border-b border-[var(--primary-dark)]">
      <div className="container mx-auto px-4 md:px-8 h-[var(--header-height)] flex justify-between items-center">
        <div className="flex items-center">
        <a href="/" className="flex-shrink-0">
        <img src={Logo} alt="Logo" className="w-[200px] h-auto" />
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
          </ul>

          <div className="flex items-center pl-4 space-x-3">
          <button
              className="px-4 py-2 rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent transition-all hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)]"
            >
              Signin/Login
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
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
                <div className="pt-4 flex flex-col space-y-3">
                  <button className="px-4 py-2 rounded border border-[var(--secondary)] text-[var(--secondary)] bg-transparent transition-all hover:bg-[var(--secondary)] hover:text-[var(--dark-bg)] hover:shadow-[0_0_10px_var(--secondary-glow)]">
                    Signin/Login
                  </button>
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

