
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Repository from "./pages/Repository";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NewRepository from "./pages/NewRepository";
import { AuthProvider } from "./contexts/AuthContext";
import { RepositoryProvider } from "./contexts/RepositoryContext";

const queryClient = new QueryClient();

const App = () => {
  // Set up dark mode based on system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for user preference in localStorage
      const storedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen dark:bg-github-dark dark:text-white">
            <AuthProvider>
              <RepositoryProvider>
                <Navbar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/repository" element={<Repository />} />
                    <Route path="/repository/:id" element={<Repository />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/new-repository" element={<NewRepository />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </RepositoryProvider>
            </AuthProvider>
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
