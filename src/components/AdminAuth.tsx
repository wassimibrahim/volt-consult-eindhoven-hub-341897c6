
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LockKeyhole } from 'lucide-react';
import { verifyAdminPassword, login, logout } from '../services/mongoDBService';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated with Supabase
    const checkAuth = async () => {
      // Check local storage first
      if (localStorage.getItem('adminAuthenticated') === 'true') {
        setIsAuthenticated(true);
        return;
      }
      
      try {
        // Then check Supabase auth
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For demo purposes only - in a real app you would use a proper auth flow
      if (email && password) {
        // Try to log in with Supabase
        await login(email, password);
      } else {
        // Fallback to password-only auth
        const isValid = await verifyAdminPassword(password);
        
        if (isValid) {
          setIsAuthenticated(true);
          localStorage.setItem('adminAuthenticated', 'true');
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      toast({
        title: "Success",
        description: "You have successfully logged in as admin.",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Access Denied",
        description: "Incorrect email or password. Please try again.",
        variant: "destructive",
      });
      setPassword('');
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      localStorage.removeItem('adminAuthenticated');
      
      toast({
        title: "Logged out",
        description: "You have been logged out of the admin area.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="bg-gray-100 p-4 mb-6 rounded-lg flex justify-between items-center">
          <p className="font-medium">Admin Dashboard</p>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <LockKeyhole size={32} className="text-gray-700" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="Enter email (optional)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Admin Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="Enter password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
