import { Button } from "@/components/ui/button";
import { FileText, LogIn, User, Sparkles, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="font-bold text-base sm:text-lg">Webie</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/templates')}>
            Templates
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/webies')}>
            Webies
          </Button>

          {isAuthenticated ? (
            <>
              <NotificationDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {(user?.isAdmin || user?.isSuperAdmin) && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
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
            <Button size="sm" onClick={() => navigate('/auth')}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && <NotificationDropdown />}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t bg-background px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/templates'); setMobileMenuOpen(false); }}>
            Templates
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/webies'); setMobileMenuOpen(false); }}>
            Webies
          </Button>
          {isAuthenticated ? (
            <>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              {(user?.isAdmin || user?.isSuperAdmin) && (
                <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                <LogIn className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
