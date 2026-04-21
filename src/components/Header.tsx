import { Button } from "@/components/ui/button";
import { FileText, LogIn, User, Sparkles, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { motion, AnimatePresence } from "framer-motion";
import webilioLogo from "@/assets/webilio-logo.png";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Templates', path: '/templates', sectionId: 'showcase' },
    { label: 'Features', path: '/features', sectionId: 'features' },
    { label: 'Webies', path: '/webies', sectionId: null },
  ];

  const handleNavClick = useCallback((link: typeof navLinks[0]) => {
    if (isHomePage && link.sectionId) {
      const el = document.getElementById(link.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileMenuOpen(false);
        return;
      }
    }
    navigate(link.path);
    setMobileMenuOpen(false);
  }, [isHomePage, navigate]);

  const isFloating = isHomePage && scrolled;
  const showBackdrop = scrolled || !isHomePage;

  return (
    <motion.header
      className="fixed z-50"
      animate={{
        top: isFloating ? 16 : 0,
        left: isFloating ? '50%' : '0%',
        x: isFloating ? '-50%' : '0%',
        width: isFloating ? 'min(680px, 90vw)' : '100%',
        borderRadius: isFloating ? 24 : 0,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      style={{
        background: isFloating
          ? 'hsl(var(--background) / 0.55)'
          : showBackdrop
            ? 'hsl(var(--background) / 0.85)'
            : 'transparent',
        backdropFilter: showBackdrop || isFloating ? 'blur(28px) saturate(180%)' : 'none',
        WebkitBackdropFilter: showBackdrop || isFloating ? 'blur(28px) saturate(180%)' : 'none',
        borderBottom: isFloating ? 'none' : showBackdrop ? '1px solid hsl(var(--border) / 0.2)' : 'none',
        boxShadow: isFloating
          ? '0 8px 40px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--border) / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.1)'
          : 'none',
      }}
    >
      <div className={`flex items-center justify-between ${isFloating ? 'px-5 py-2' : 'container px-4 h-16'}`}>
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => {
            if (isHomePage) window.scrollTo({ top: 0, behavior: 'smooth' });
            else navigate('/');
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <img src={webilioLogo} alt="Webilio" className="h-9 w-9 object-contain" />
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Webilio
          </span>
        </motion.div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                location.pathname === link.path
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {link.label}
            </motion.button>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-1 ml-2">
              <NotificationDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-accent/60 transition-colors">
                    <Avatar className="w-7 h-7 ring-2 ring-primary/20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card rounded-xl p-1">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-lg cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  {(user?.isAdmin || user?.isSuperAdmin) && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-lg cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive rounded-lg cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                className="ml-2 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </motion.div>
          )}
        </nav>

        {/* Mobile toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && <NotificationDropdown />}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="sm:hidden border-t border-border/30 px-4 py-3 space-y-1"
            style={{ background: 'hsl(var(--background) / 0.95)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => handleNavClick(link)}>
                  {link.label}
                </Button>
              </motion.div>
            ))}
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </Button>
                {(user?.isAdmin || user?.isSuperAdmin) && (
                  <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}>
                    <FileText className="mr-2 h-4 w-4" /> Admin Panel
                  </Button>
                )}
                <Button variant="ghost" className="w-full justify-start text-destructive rounded-xl" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <LogIn className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Button className="w-full rounded-xl" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
