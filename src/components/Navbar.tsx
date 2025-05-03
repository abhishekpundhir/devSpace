
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, User, LogIn, BookOpen, Code, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import "./nav.css"

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    if (typeof window !== 'undefined') {
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    setIsDarkMode(newMode);
    toast({
      title: `${newMode ? 'Dark' : 'Light'} mode activated`,
      description: `The theme has been switched to ${newMode ? 'dark' : 'light'} mode`,
    });
  };

  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleNewRepository = () => {
    navigate('/new-repository');
  };

  return (
    <nav className="bg-github dark:bg-github-dark border-b border-github-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-4">
          <Link to="/" className=" flex items-center justify-center  flex-shrink-0">
{/*             <img src="public/social.png"   className="xximg" alt="DevSpace Logo" /> */}
            <h4 className="hhhh"><b> DevSpace.Com</b></h4> 
            
          </Link>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search or jump to..."
              className="w-64 py-1 pl-10 pr-3 text-sm bg-github-dark/10 dark:bg-white/10 focus:bg-white dark:focus:bg-github-dark placeholder:text-github-text border-github-border"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-xs text-gray-400">/</span>
          </div>

          <div className="hidden lg:flex space-x-4 text-gray-300">
            <Link to="/dashboard" className="hover:text-white">Repositories</Link>
            {/* <Link to="/explore" className="hover:text-white">Explore</Link> */}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-300 hover:text-white" 
            onClick={toggleTheme}
            title={`Toggle ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Bell className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Plus className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleNewRepository}>
                <BookOpen className="w-4 h-4 mr-2" />
                <span>New repository</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Code className="w-4 h-4 mr-2" />
                <span>New gist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p>{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="w-4 h-4 mr-2" />
                  <span>Your profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleLogin} className="text-gray-300 hover:text-white">
              <LogIn className="w-4 h-4 mr-2" /> Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
