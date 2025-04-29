
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
  type: 'volt' | 'project' | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  documents: string[];
  documentData?: string[];
  date: string;
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
