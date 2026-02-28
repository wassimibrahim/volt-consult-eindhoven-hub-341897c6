
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

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Check local storage first for quick access
        if (localStorage.getItem('adminAuthenticated') === 'true') {
          setIsAuthenticated(true);
          setIsAdmin(true);
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }
        
        // Then check Supabase auth session
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Check if the user has admin role
          const userRole = await getUserRole();
          const hasAdminAccess = userRole === 'admin';
          
          setIsAuthenticated(true);
          setIsAdmin(hasAdminAccess);
          
          if (hasAdminAccess) {
            localStorage.setItem('adminAuthenticated', 'true');
          } else {
            // If authenticated but not admin, show message and redirect
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
        localStorage.removeItem('adminAuthenticated');
      } finally {
        setAuthChecked(true);
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        // Check role on auth state change
        const userRole = await getUserRole();
        const hasAdminAccess = userRole === 'admin';
        setIsAdmin(hasAdminAccess);
        
        if (hasAdminAccess) {
          localStorage.setItem('adminAuthenticated', 'true');
        } else {
          localStorage.removeItem('adminAuthenticated');
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('adminAuthenticated');
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check against required admin credentials
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('adminAuthenticated', 'true');
        toast({
          title: "Success",
          description: "You have successfully logged in as admin.",
        });
        return;
      }
      
      // If credentials don't match, try Supabase auth (if email is provided)
      if (username.includes('@')) {
        try {
          // Try to log in with Supabase
          await login(username, password);
          
          // Check if the user has admin role
          const userRole = await getUserRole();
          const hasAdminAccess = userRole === 'admin';
          
          if (hasAdminAccess) {
            setIsAdmin(true);
            localStorage.setItem('adminAuthenticated', 'true');
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
            // Sign out non-admin users
            await logout();
            setIsAuthenticated(false);
          }
        } catch (loginError: any) {
          console.error('Login error:', loginError);
          throw new Error(loginError.message || 'Invalid credentials');
        }
      } else {
        // If username doesn't contain @ and doesn't match admin credentials
        throw new Error('Invalid username or password. Please try again.');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Access Denied",
        description: error.message || "Incorrect username or password. Please try again.",
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
      localStorage.removeItem('adminAuthenticated');
      
      toast({
        title: "Logged out",
        description: "You have been logged out of the admin area.",
      });
      
      // Redirect to home page
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
          
          <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
          
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                placeholder="Enter username"
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
