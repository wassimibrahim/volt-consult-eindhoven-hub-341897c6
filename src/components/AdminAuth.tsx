
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LockKeyhole, AlertCircle, Loader2 } from 'lucide-react';
import { login, logout } from '../services/supabaseService';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();

  // Check admin role server-side via the has_role function
  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return data === true;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthenticated(true);
          const hasAdminAccess = await checkAdminRole(data.session.user.id);
          setIsAdmin(hasAdminAccess);
          
          if (!hasAdminAccess) {
            toast({
              title: "Access Denied",
              description: "You don't have admin privileges to access this area.",
              variant: "destructive",
            });
            setTimeout(() => navigate('/'), 2000);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setAuthChecked(true);
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      if (isAuth && session) {
        const hasAdminAccess = await checkAdminRole(session.user.id);
        setIsAdmin(hasAdminAccess);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up new account
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        toast({
          title: "Account Created",
          description: "Account created successfully. An admin must assign you the admin role before you can access the dashboard.",
        });
        setIsSignUp(false);
        setPassword('');
        return;
      }

      // Authenticate via Supabase Auth only
      await login(email, password);
      
      // Get session to check admin role server-side
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Authentication failed');
      }
      
      const hasAdminAccess = await checkAdminRole(sessionData.session.user.id);
      
      if (hasAdminAccess) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        toast({
          title: "Success",
          description: "You have successfully logged in as admin.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Your account doesn't have admin privileges.",
          variant: "destructive",
        });
        await logout();
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: error.message || "Incorrect email or password. Please try again.",
        variant: "destructive",
      });
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      toast({
        title: "Logged out",
        description: "You have been logged out of the admin area.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-700 mx-auto" />
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return (
      <div>
        <div className="bg-gray-100 p-4 mb-6 rounded-lg flex justify-between items-center">
          <p className="font-medium">Admin Dashboard</p>
          <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isLoading ? 'Processing...' : 'Logout'}
          </Button>
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
          
          <h1 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Create Account' : 'Admin Access'}</h1>
          
          {isAuthenticated && !isAdmin && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-700 font-medium">Access Denied</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Your account doesn't have admin privileges. Please log in with an admin account.
                </p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="Enter admin email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
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
