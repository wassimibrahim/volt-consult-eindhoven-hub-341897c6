
import { Application, Message, User } from '../types/models';
import { toast } from "@/components/ui/use-toast";

// Base URL for the API
const API_URL = 'https://your-backend-api.com/api'; // Replace with your actual API URL

// Applications
export const getApplications = async (): Promise<Application[]> => {
  try {
    const response = await fetch(`${API_URL}/applications`);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return await response.json();
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

export const saveApplication = async (application: Omit<Application, '_id' | 'createdAt'>): Promise<Application> => {
  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    });
    
    if (!response.ok) throw new Error('Failed to save application');
    return await response.json();
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

// Messages
export const getMessages = async (): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_URL}/messages`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
  } catch (error) {
    console.error('Error getting messages:', error);
    toast({
      title: "Error",
      description: "Failed to fetch messages. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const saveMessage = async (message: Omit<Message, '_id' | 'createdAt'>): Promise<Message> => {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) throw new Error('Failed to save message');
    return await response.json();
  } catch (error) {
    console.error('Error saving message:', error);
    toast({
      title: "Error",
      description: "Failed to save message. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

// Users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error getting users:', error);
    toast({
      title: "Error",
      description: "Failed to fetch users. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

