
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cv: string;
  motivationLetter: string;
  date: string;
}
