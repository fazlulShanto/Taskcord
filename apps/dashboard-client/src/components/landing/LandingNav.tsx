import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#' },
    { name: 'Community', href: '#' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-gray-900/80 backdrop-blur-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo_128.png" alt="Task Waku Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-white">Task Waku</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-gray-900/95 backdrop-blur-lg md:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.name}
                </a>
              ))}
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
