
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface Application {
  _id: string;
  fullName: string;
  email: string;
  position: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cv: string;
  motivationLetter: string;
  createdAt: Date;
}
