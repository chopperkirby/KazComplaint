import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/../../shared/types';
import { nanoid } from 'nanoid';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Determine role based on email domain
function getRoleFromEmail(email: string): UserRole {
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain === 'gov.kz') {
    return 'government';
  }
  return 'citizen';
}

// Get avatar based on role
function getAvatarFromRole(role: UserRole): string {
  return role === 'government' ? '👨‍💼' : '👤';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('kazcomplaint_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    const role = getRoleFromEmail(email);
    const newUser: User = {
      id: nanoid(),
      email,
      name: email.split('@')[0],
      role,
      avatar: getAvatarFromRole(role),
      district: role === 'citizen' ? 'Alatau' : undefined,
      department: role === 'government' ? 'Экология' : undefined,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('kazcomplaint_user', JSON.stringify(newUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const role = getRoleFromEmail(email);
    const newUser: User = {
      id: nanoid(),
      email,
      name,
      role,
      avatar: getAvatarFromRole(role),
      district: role === 'citizen' ? 'Alatau' : undefined,
      department: role === 'government' ? 'Экология' : undefined,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('kazcomplaint_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('kazcomplaint_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
