
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LockKeyhole } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'VCGEindhovenLebanon10452*') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast({
        title: "Success",
        description: "You have successfully logged in as admin.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin area.",
    });
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
          
          <form onSubmit={handleSubmit}>
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
            
            <Button type="submit" className="w-full">
              Login
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
