
import { toast } from "@/components/ui/use-toast";

// Types
export interface ApplicationType {
  id: number;
  fullName: string;
  position: string;
  type: 'volt' | 'project' | null;
  date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  documents: string[];
  documentData?: string[]; // Base64 encoded file data
  details: {
    firstName?: string;
    familyName?: string;
    birthDate: string;
    degreeProgram: string;
    yearOfStudy: string;
    email?: string;
    phoneNumber?: string;
    linkedinProfile: string;
  };
}

export interface PositionType {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  type: 'volt' | 'project';
  companyName?: string;
  projectDescription?: string;
  preferredMajors?: string[];
  active: boolean;
  deadline?: string;
  publishedDate?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

// Base URL for our API
const API_URL = 'https://your-backend-api-url.com/api'; // Replace with your actual backend URL

// Applications
export const getApplications = async (): Promise<ApplicationType[]> => {
  try {
    // For development/demo, we'll fall back to localStorage if the API call fails
    try {
      const response = await fetch(`${API_URL}/applications`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      const stored = localStorage.getItem('applications');
      return stored ? JSON.parse(stored) : [];
    }
  } catch (error) {
    console.error('Error getting applications:', error);
    toast({
      title: "Error",
      description: "Failed to fetch applications. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const saveApplication = async (application: Omit<ApplicationType, 'id'>): Promise<ApplicationType> => {
  try {
    try {
      // Try API first
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      
      if (!response.ok) throw new Error('Failed to save application');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      // Fallback to localStorage
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const newId = existingApplications.length > 0 
        ? Math.max(...existingApplications.map((app: ApplicationType) => app.id)) + 1 
        : 1;
        
      const newApplication = { ...application, id: newId };
      localStorage.setItem('applications', JSON.stringify([...existingApplications, newApplication]));
      return newApplication;
    }
  } catch (error) {
    console.error('Error saving application:', error);
    toast({
      title: "Error",
      description: "Failed to save application. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateApplicationStatus = async (id: number, status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): Promise<ApplicationType[]> => {
  try {
    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Failed to update application status');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      // Fallback to localStorage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = applications.map((app: ApplicationType) => 
        app.id === id ? { ...app, status } : app
      );
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      return updatedApplications;
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    toast({
      title: "Error",
      description: "Failed to update application status. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

// Positions
export const getPositions = async (): Promise<PositionType[]> => {
  try {
    try {
      const response = await fetch(`${API_URL}/positions`);
      if (!response.ok) throw new Error('Failed to fetch positions');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      const stored = localStorage.getItem('positions');
      return stored ? JSON.parse(stored) : [];
    }
  } catch (error) {
    console.error('Error getting positions:', error);
    toast({
      title: "Error",
      description: "Failed to fetch positions. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const savePosition = async (position: Omit<PositionType, 'id'>): Promise<PositionType> => {
  try {
    try {
      const response = await fetch(`${API_URL}/positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position),
      });
      
      if (!response.ok) throw new Error('Failed to save position');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      // Fallback to localStorage
      const existingPositions = JSON.parse(localStorage.getItem('positions') || '[]');
      const newId = existingPositions.length > 0 
        ? Math.max(...existingPositions.map((pos: PositionType) => pos.id)) + 1 
        : 1;
        
      const newPosition = { ...position, id: newId };
      localStorage.setItem('positions', JSON.stringify([...existingPositions, newPosition]));
      return newPosition;
    }
  } catch (error) {
    console.error('Error saving position:', error);
    toast({
      title: "Error",
      description: "Failed to save position. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

export const updatePosition = async (id: number, position: Partial<PositionType>): Promise<PositionType[]> => {
  try {
    try {
      const response = await fetch(`${API_URL}/positions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position),
      });
      
      if (!response.ok) throw new Error('Failed to update position');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      // Fallback to localStorage
      const positions = JSON.parse(localStorage.getItem('positions') || '[]');
      const updatedPositions = positions.map((pos: PositionType) => 
        pos.id === id ? { ...pos, ...position } : pos
      );
      localStorage.setItem('positions', JSON.stringify(updatedPositions));
      return updatedPositions;
    }
  } catch (error) {
    console.error('Error updating position:', error);
    toast({
      title: "Error",
      description: "Failed to update position. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

export const deletePosition = async (id: number): Promise<PositionType[]> => {
  try {
    try {
      const response = await fetch(`${API_URL}/positions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete position');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      // Fallback to localStorage
      const positions = JSON.parse(localStorage.getItem('positions') || '[]');
      const updatedPositions = positions.filter((pos: PositionType) => pos.id !== id);
      localStorage.setItem('positions', JSON.stringify(updatedPositions));
      return updatedPositions;
    }
  } catch (error) {
    console.error('Error deleting position:', error);
    toast({
      title: "Error",
      description: "Failed to delete position. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

// Contact Messages
export const saveContactMessage = async (message: { name: string; email: string; message: string }): Promise<ContactMessage> => {
  try {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      
      if (!response.ok) throw new Error('Failed to save contact message');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      // Fallback to localStorage
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const newMessage = {
        ...message,
        id: existingMessages.length > 0 ? Math.max(...existingMessages.map((msg: ContactMessage) => msg.id)) + 1 : 1,
        date: new Date().toISOString()
      };
      localStorage.setItem('contactMessages', JSON.stringify([...existingMessages, newMessage]));
      return newMessage as ContactMessage;
    }
  } catch (error) {
    console.error('Error saving contact message:', error);
    toast({
      title: "Error",
      description: "Failed to save contact message. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    try {
      const response = await fetch(`${API_URL}/contact`);
      if (!response.ok) throw new Error('Failed to fetch contact messages');
      return await response.json();
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      const stored = localStorage.getItem('contactMessages');
      return stored ? JSON.parse(stored) : [];
    }
  } catch (error) {
    console.error('Error getting contact messages:', error);
    toast({
      title: "Error",
      description: "Failed to fetch contact messages. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Admin Authentication
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) return false;
      return true;
    } catch (error) {
      console.error('API Error, using localStorage fallback:', error);
      // Fallback to hardcoded password check
      return password === 'VCGEindhovenLebanon10452*';
    }
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
};
