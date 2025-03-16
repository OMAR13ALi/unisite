
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Research', path: '/research' },
    { name: 'Publications', path: '/publications' },
    { name: 'Teaching', path: '/teaching' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-serif font-medium tracking-tight"
          >
            Prof. Smith
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-8 mr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'hover-underline-animation py-1 font-medium text-sm transition-colors',
                    location.pathname === link.path 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* Auth Buttons */}
            {user ? (
              <Button variant="outline" onClick={signOut} size="sm">
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <LogIn size={16} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="flex items-center gap-1">
                    <UserPlus size={16} />
                    <span>Register</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'py-3 px-4 text-center transition-colors',
                  location.pathname === link.path 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 mt-4 px-4">
              {user ? (
                <Button variant="outline" onClick={signOut} className="w-full">
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <LogIn size={16} />
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="w-full flex items-center justify-center gap-2">
                      <UserPlus size={16} />
                      <span>Register</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
