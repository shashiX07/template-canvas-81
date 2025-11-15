import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { userStorage, User } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = userStorage.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = userStorage.getAll();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      userStorage.setCurrentUser(foundUser);
      setUser(foundUser);
      toast.success(`Welcome back, ${foundUser.name}!`);
      return true;
    }

    toast.error('Invalid email or password');
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const users = userStorage.getAll();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      toast.error('Email already registered');
      return false;
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'user',
      dob: '',
      phone: '',
      isVerified: false,
      isAdmin: false,
      isSuperAdmin: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      customizedTemplates: [],
      draftTemplates: []
    };

    userStorage.save(newUser);
    userStorage.setCurrentUser(newUser);
    setUser(newUser);
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
