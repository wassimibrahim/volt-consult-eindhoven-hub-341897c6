
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Message {
  id: string; // Changed from _id to id to be consistent with Supabase
  name: string;
  email: string;
  message: string;
  date: string; // Changed from createdAt: Date to date: string
}

export interface Application {
  id: string; // Changed from _id to id to be consistent with Supabase
  fullName: string;
  email: string;
  position: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cv: string;
  motivationLetter: string;
  date: string; // Changed from createdAt: Date to date: string
}
