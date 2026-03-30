import { Button } from "@/components/ui/button";
import { FileText, LogIn, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import webilioLogo from "@/assets/webilio_logo.png";

export function FloatingNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "top-4 left-1/2 -translate-x-1/2 max-w-3xl w-[92%] rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl shadow-[0_8px_32px_hsl(var(--primary)/0.15)]"
            : "w-full bg-transparent"
        }`}
        initial={false}
        animate={{
          y: scrolled ? 0 : 0,
        }}
        style={scrolled ? { position: "fixed", left: "50%", transform: "translateX(-50%)" } : {}}
      >
        <div className={`flex items-center justify-between ${scrolled ? "px-4 py-2" : "container mx-auto px-6 py-4"}`}>
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img src={webilioLogo} alt="Webilio" className={`transition-all duration-300 ${scrolled ? "w-8 h-8" : "w-10 h-10"}`} />
            <span className={`font-bold tracking-tight transition-all duration-300 ${scrolled ? "text-base" : "text-lg"}`}>
              Webilio
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {["Templates", "Webies"].map((item) => (
              <Button
                key={item}
                variant="ghost"
                size="sm"
                className="text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl"
                onClick={() => navigate(`/${item.toLowerCase()}`)}
              >
                {item}
              </Button>
            ))}

            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline text-sm">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {(user?.isAdmin || user?.isSuperAdmin) && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <FileText className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogIn className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                size="sm"
                className="rounded-xl ml-2 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                onClick={() => navigate("/auth")}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </nav>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
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
              className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1 rounded-b-2xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate("/templates"); setMobileMenuOpen(false); }}>
                Templates
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate("/webies"); setMobileMenuOpen(false); }}>
                Webies
              </Button>
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Button>
                  {(user?.isAdmin || user?.isSuperAdmin) && (
                    <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}>
                      <FileText className="mr-2 h-4 w-4" /> Admin Panel
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full justify-start text-destructive rounded-xl" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    <LogIn className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <Button className="w-full rounded-xl" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
