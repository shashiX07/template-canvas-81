import { Button } from "@/components/ui/button";
import { FileText, LogIn, User, Sparkles, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Templates', path: '/templates' },
    { label: 'Webies', path: '/webies' },
  ];

  // Floating island style when scrolled on homepage
  const isFloating = isHomePage && scrolled;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isFloating
          ? 'top-3 left-1/2 -translate-x-1/2 max-w-2xl w-[90%] mx-auto rounded-2xl border border-border/40 shadow-elegant'
          : 'w-full border-b border-border/30'
      }`}
      style={{
        background: isFloating
          ? 'hsl(var(--background) / 0.7)'
          : scrolled || !isHomePage
            ? 'hsl(var(--background) / 0.85)'
            : 'transparent',
        backdropFilter: scrolled || !isHomePage ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled || !isHomePage ? 'blur(20px) saturate(180%)' : 'none',
      }}
      initial={false}
      animate={{
        y: 0,
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={`flex items-center justify-between ${isFloating ? 'px-4 py-2' : 'container px-4 h-16'}`}>
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-bold text-lg tracking-tight">Webie</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-accent/80 ${
                location.pathname === link.path
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-1 ml-2">
              <NotificationDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-accent/80 transition-colors">
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
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {(user?.isAdmin || user?.isSuperAdmin) && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-lg cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive rounded-lg cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              size="sm"
              className="ml-2 rounded-xl shadow-elegant hover:shadow-glow transition-all"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && <NotificationDropdown />}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <Button key={link.path} variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}>
                {link.label}
              </Button>
            ))}
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                {(user?.isAdmin || user?.isSuperAdmin) && (
                  <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}>
                    <FileText className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                )}
                <Button variant="ghost" className="w-full justify-start text-destructive rounded-xl" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button className="w-full rounded-xl" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
