
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced mock users with Indian names
const mockUsers = [
  {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun@example.com',
    password: 'password123',
    avatar: 'https://github.com/identicons/arjun-sharma.png'
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    avatar: 'https://github.com/identicons/priya-patel.png'
  },
  {
    id: '3',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    password: 'password123',
    avatar: 'https://github.com/identicons/rahul-verma.png'
  },
  {
    id: '4',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
    avatar: 'https://github.com/identicons/demo-user.png'
  },
  {
    id: '5',
    name: 'Ananya Desai',
    email: 'ananya@example.com',
    password: 'password123',
    avatar: 'https://github.com/identicons/ananya-desai.png'
  },
  {
    id: '6',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    password: 'password123',
    avatar: 'https://github.com/identicons/vikram-singh.png'
  },
  {
    id: '7',
    name: 'Kavita Mehta',
    email: 'kavita@example.com',
    password: 'password123',
    avatar: 'https://github.com/identicons/kavita-mehta.png'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, this would call an API
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful",
        description: `Welcome, ${userWithoutPassword.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // Mock signup - in a real app, this would call an API
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        password,
        avatar: `https://github.com/identicons/${name.toLowerCase().replace(/\s+/g, '-')}.png`
      };
      
      mockUsers.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Account created",
        description: `Welcome, ${name}! Your account has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully. Thank you!",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user logged in');
      
      // Update the mock user
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update the mock users array
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...data,
          password: mockUsers[userIndex].password // Preserve password
        };
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
