
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface PositionType {
  id: string;
  title: string;
  description: string;
  type: 'volt' | 'project';
  requirements?: string[];
  preferredMajors?: string[];
  companyName?: string;
  projectDescription?: string;
  active: boolean;
  publishedDate?: string;
  deadline?: string;
  createdAt?: string;
}

export interface ApplicationType {
  id: string;
  fullName: string;
  email: string;
  position: string;
  type: 'volt' | 'project';
  date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  documents: string[];
  documentData?: string[];
  details: {
    firstName?: string;
    familyName?: string;
    birthDate: string;
    degreeProgram?: string;
    yearOfStudy?: string;
    phoneNumber?: string;
    email?: string;
    linkedinProfile?: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

// Authentication
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const verifyAdminPassword = async (password: string) => {
  // For demo purposes, use a hardcoded admin password
  // In production, you should use proper authentication
  const adminPassword = 'admin123';
  return password === adminPassword;
};

// Positions
export const getPositions = async (): Promise<PositionType[]> => {
  try {
    const { data, error } = await supabase
      .from('positions')
      .select('*');
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type as 'volt' | 'project',
      requirements: item.requirements || [],
      preferredMajors: item.preferred_majors || [],
      companyName: item.company_name,
      projectDescription: item.project_description,
      active: item.active || false,
      publishedDate: item.published_date ? new Date(item.published_date).toISOString().split('T')[0] : undefined,
      deadline: item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : undefined,
      createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : undefined
    }));
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
};

export const savePosition = async (position: Omit<PositionType, 'id'>): Promise<PositionType> => {
  try {
    const insertData = {
      title: position.title,
      description: position.description,
      type: position.type,
      requirements: position.requirements || [],
      preferred_majors: position.preferredMajors || [],
      company_name: position.companyName,
      project_description: position.projectDescription,
      active: position.active,
      published_date: position.publishedDate ? new Date(position.publishedDate) : new Date(),
      deadline: position.deadline ? new Date(position.deadline) : null
    };

    const { data, error } = await supabase
      .from('positions')
      .insert(insertData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type as 'volt' | 'project',
      requirements: data.requirements || [],
      preferredMajors: data.preferred_majors || [],
      companyName: data.company_name,
      projectDescription: data.project_description,
      active: data.active || false,
      publishedDate: data.published_date ? new Date(data.published_date).toISOString().split('T')[0] : undefined,
      deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : undefined,
      createdAt: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : undefined
    };
  } catch (error) {
    console.error('Error saving position:', error);
    throw error;
  }
};

export const updatePosition = async (id: string, position: Partial<PositionType>): Promise<PositionType> => {
  try {
    const updateData: any = {};
    
    if (position.title) updateData.title = position.title;
    if (position.description) updateData.description = position.description;
    if (position.type) updateData.type = position.type;
    if (position.requirements) updateData.requirements = position.requirements;
    if (position.preferredMajors) updateData.preferred_majors = position.preferredMajors;
    if (position.companyName) updateData.company_name = position.companyName;
    if (position.projectDescription) updateData.project_description = position.projectDescription;
    if (position.active !== undefined) updateData.active = position.active;
    if (position.publishedDate) updateData.published_date = new Date(position.publishedDate);
    if (position.deadline) updateData.deadline = new Date(position.deadline);
    
    const { data, error } = await supabase
      .from('positions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type as 'volt' | 'project',
      requirements: data.requirements || [],
      preferredMajors: data.preferred_majors || [],
      companyName: data.company_name,
      projectDescription: data.project_description,
      active: data.active || false,
      publishedDate: data.published_date ? new Date(data.published_date).toISOString().split('T')[0] : undefined,
      deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : undefined,
      createdAt: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : undefined
    };
  } catch (error) {
    console.error('Error updating position:', error);
    throw error;
  }
};

export const deletePosition = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('positions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting position:', error);
    throw error;
  }
};

// Applications
export const getApplications = async (): Promise<ApplicationType[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*');
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    return (data || []).map(item => {
      // Ensure the details object matches our expected type by safely parsing it
      let typedDetails: ApplicationType['details'];
      
      if (typeof item.details === 'object' && item.details !== null) {
        typedDetails = {
          birthDate: (item.details as any).birthDate || new Date().toISOString().split('T')[0],
          firstName: (item.details as any).firstName,
          familyName: (item.details as any).familyName,
          degreeProgram: (item.details as any).degreeProgram,
          yearOfStudy: (item.details as any).yearOfStudy,
          phoneNumber: (item.details as any).phoneNumber,
          email: (item.details as any).email,
          linkedinProfile: (item.details as any).linkedinProfile
        };
      } else {
        // Default details if missing
        typedDetails = {
          birthDate: new Date().toISOString().split('T')[0]
        };
      }
      
      return {
        id: item.id,
        fullName: item.full_name,
        email: item.email,
        position: item.position,
        type: item.position_type as 'volt' | 'project',
        date: item.application_date ? new Date(item.application_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: item.status as 'pending' | 'reviewed' | 'accepted' | 'rejected',
        documents: ['CV', 'Motivation Letter'],
        documentData: [item.cv_url, item.motivation_letter_url].filter(Boolean),
        details: typedDetails
      };
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

export const saveApplication = async (application: {
  fullName: string;
  email?: string;
  position: string;
  type?: 'volt' | 'project' | null;
  documents?: string[];
  documentData?: string[];
  details: {
    firstName?: string;
    familyName?: string;
    birthDate: string;
    degreeProgram?: string;
    yearOfStudy?: string;
    phoneNumber?: string;
    email?: string;
    linkedinProfile?: string;
  };
}): Promise<ApplicationType> => {
  try {
    // Ensure we have the email from either the main object or the details
    const email = application.email || application.details.email;
    if (!email) {
      throw new Error('Email is required');
    }

    // Extract CV and motivation letter from documentData if provided
    const cvUrl = application.documentData?.[0] || null;
    const motivationLetterUrl = application.documentData?.[1] || null;
    
    const { data, error } = await supabase
      .from('applications')
      .insert({
        full_name: application.fullName,
        email: email,
        position: application.position,
        position_type: application.type || 'volt',
        status: 'pending',
        cv_url: cvUrl,
        motivation_letter_url: motivationLetterUrl,
        details: application.details
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      position: data.position,
      type: data.position_type as 'volt' | 'project',
      date: data.application_date ? new Date(data.application_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: data.status as 'pending' | 'reviewed' | 'accepted' | 'rejected',
      documents: ['CV', 'Motivation Letter'],
      documentData: [data.cv_url, data.motivation_letter_url].filter(Boolean),
      details: data.details as {
        firstName?: string;
        familyName?: string;
        birthDate: string;
        degreeProgram?: string;
        yearOfStudy?: string;
        phoneNumber?: string;
        email?: string;
        linkedinProfile?: string;
      } || {
        birthDate: '',
      }
    };
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (id: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): Promise<ApplicationType[]> => {
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
    
    // Return updated list of applications
    return getApplications();
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

// Contact Messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*');
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      message: item.message,
      date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
};

export const saveContactMessage = async (message: { name: string; email: string; message: string }): Promise<ContactMessage> => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: message.name,
        email: message.email,
        message: message.message
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      message: data.message,
      date: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw error;
  }
};
