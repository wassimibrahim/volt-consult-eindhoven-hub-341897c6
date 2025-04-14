
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { FileText, Search, Download, UserCheck, UserX } from 'lucide-react';

// Sample application data
const sampleApplications = [
  {
    id: 1,
    fullName: 'John Smith',
    position: 'Technology Consultant',
    type: 'volt',
    date: '2025-04-10',
    status: 'pending',
    documents: ['CV', 'Motivation Letter'],
    details: {
      birthDate: '1999-05-15',
      degreeProgram: 'Master - Computer Science',
      yearOfStudy: '2nd Year',
      linkedinProfile: 'https://linkedin.com/in/johnsmith',
    }
  },
  {
    id: 2,
    fullName: 'Emma Johnson',
    position: 'Data Analyst',
    type: 'volt',
    date: '2025-04-09',
    status: 'reviewed',
    documents: ['CV', 'Motivation Letter'],
    details: {
      birthDate: '2000-08-22',
      degreeProgram: 'Bachelor - Data Science',
      yearOfStudy: '3rd Year',
      linkedinProfile: 'https://linkedin.com/in/emmajohnson',
    }
  },
  {
    id: 3,
    fullName: 'Michael Brown',
    position: 'Data Scientist',
    type: 'project',
    date: '2025-04-08',
    status: 'pending',
    documents: ['CV', 'Motivation Letter'],
    details: {
      birthDate: '1998-03-12',
      degreeProgram: 'Master - Data Science Engineering',
      yearOfStudy: '1st Year',
      linkedinProfile: 'https://linkedin.com/in/michaelbrown',
    }
  },
  {
    id: 4,
    fullName: 'Sophia Garcia',
    position: 'Machine Learning Engineer',
    type: 'project',
    date: '2025-04-07',
    status: 'rejected',
    documents: ['CV', 'Motivation Letter'],
    details: {
      birthDate: '1997-11-30',
      degreeProgram: 'PhD - Computer Science',
      yearOfStudy: '2nd Year',
      linkedinProfile: 'https://linkedin.com/in/sophiagarcia',
    }
  },
  {
    id: 5,
    fullName: 'William Lee',
    position: 'Software Developer',
    type: 'volt',
    date: '2025-04-06',
    status: 'accepted',
    documents: ['CV', 'Motivation Letter'],
    details: {
      birthDate: '1999-02-18',
      degreeProgram: 'Bachelor - Computer Science',
      yearOfStudy: '4th Year',
      linkedinProfile: 'https://linkedin.com/in/williamlee',
    }
  }
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const AdminPage = () => {
  const [applications, setApplications] = useState(sampleApplications);
  const [selectedApplication, setSelectedApplication] = useState<typeof sampleApplications[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'volt' | 'project'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || app.type === filterType;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = (id: number, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, status } : app
    );
    setApplications(updatedApplications);
    
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({ ...selectedApplication, status });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h1 className="heading-lg text-volt-dark mb-6">Admin Dashboard</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search applications..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  className="px-3 py-2 rounded-md border border-gray-300"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                >
                  <option value="all">All Types</option>
                  <option value="volt">Volt Applications</option>
                  <option value="project">Project Applications</option>
                </select>
                
                <select
                  className="px-3 py-2 rounded-md border border-gray-300"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <TableRow 
                        key={app.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <TableCell className="font-medium">{app.fullName}</TableCell>
                        <TableCell>{app.position}</TableCell>
                        <TableCell className="capitalize">{app.type}</TableCell>
                        <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {app.documents.map((doc, idx) => (
                              <div 
                                key={idx}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
                                title={`Download ${doc}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FileText size={16} />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No applications found with the current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {selectedApplication && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="heading-md text-volt-dark">{selectedApplication.fullName}</h2>
                  <p className="text-gray-600">{selectedApplication.position} ({selectedApplication.type === 'volt' ? 'Volt Application' : 'Project Application'})</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-2"
                    onClick={() => handleStatusChange(selectedApplication.id, 'accepted')}
                  >
                    <UserCheck size={18} />
                    Accept
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2"
                    onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                  >
                    <UserX size={18} />
                    Reject
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-sm">Full Name</p>
                      <p className="font-medium">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Birth Date</p>
                      <p>{new Date(selectedApplication.details.birthDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Degree Program</p>
                      <p>{selectedApplication.details.degreeProgram}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Year of Study</p>
                      <p>{selectedApplication.details.yearOfStudy}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">LinkedIn Profile</p>
                      <a 
                        href={selectedApplication.details.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedApplication.details.linkedinProfile}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <div className="space-y-4">
                    {selectedApplication.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="text-gray-500" />
                          <span>{doc}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Application Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {(['pending', 'reviewed', 'accepted', 'rejected'] as const).map((status) => (
                        <button
                          key={status}
                          className={`px-4 py-2 rounded-lg capitalize ${
                            selectedApplication.status === status 
                              ? statusColors[status]
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleStatusChange(selectedApplication.id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
