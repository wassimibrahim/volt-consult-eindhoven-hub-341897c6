
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminAuth from '../components/AdminAuth';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Search, Download, UserCheck, UserX, Plus, Save, Trash, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { format, differenceInDays, differenceInHours, differenceInMinutes, isFuture, isPast } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Define application type
interface ApplicationType {
  id: number;
  fullName: string;
  position: string;
  type: 'volt' | 'project' | null;
  date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  documents: string[];
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

// Define position type
interface PositionType {
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
}

// Sample application data as fallback
const sampleApplications: ApplicationType[] = [
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
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'volt' | 'project'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all');
  
  const [positions, setPositions] = useState<PositionType[]>([]);
  const [newPosition, setNewPosition] = useState<Partial<PositionType>>({
    title: '',
    description: '',
    requirements: [],
    type: 'volt',
    active: true,
    deadline: new Date().toISOString().split('T')[0]
  });
  const [reqInput, setReqInput] = useState('');
  const [majorInput, setMajorInput] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'positions'>('applications');
  const [positionTab, setPositionTab] = useState<'volt' | 'project'>('volt');
  const [editingPositionId, setEditingPositionId] = useState<number | null>(null);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const loadData = () => {
      try {
        const storedApplications = localStorage.getItem('applications');
        const parsedApplications = storedApplications ? JSON.parse(storedApplications) : [];
        
        if (parsedApplications && parsedApplications.length > 0) {
          setApplications(parsedApplications);
          console.log('Loaded applications from localStorage:', parsedApplications);
        } else {
          setApplications(sampleApplications);
          console.log('No stored applications found, using samples');
        }

        const storedPositions = localStorage.getItem('positions');
        if (storedPositions) {
          setPositions(JSON.parse(storedPositions));
          console.log('Loaded positions from localStorage:', JSON.parse(storedPositions));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setApplications(sampleApplications);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (positions.length > 0) {
      localStorage.setItem('positions', JSON.stringify(positions));
    }
  }, [positions]);

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
    
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({ ...selectedApplication, status });
    }
  };

  const handleAddRequirement = () => {
    if (reqInput.trim()) {
      setNewPosition({
        ...newPosition,
        requirements: [...(newPosition.requirements || []), reqInput.trim()]
      });
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedReqs = [...(newPosition.requirements || [])];
    updatedReqs.splice(index, 1);
    setNewPosition({
      ...newPosition,
      requirements: updatedReqs
    });
  };

  const handleAddMajor = () => {
    if (majorInput.trim()) {
      setNewPosition({
        ...newPosition,
        preferredMajors: [...(newPosition.preferredMajors || []), majorInput.trim()]
      });
      setMajorInput('');
    }
  };

  const handleRemoveMajor = (index: number) => {
    const updatedMajors = [...(newPosition.preferredMajors || [])];
    updatedMajors.splice(index, 1);
    setNewPosition({
      ...newPosition,
      preferredMajors: updatedMajors
    });
  };

  const handleSavePosition = () => {
    if (!newPosition.title || !newPosition.description || !deadlineDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including the application deadline.",
        variant: "destructive",
      });
      return;
    }

    const formattedDeadline = deadlineDate.toISOString();

    if (editingPositionId !== null) {
      const updatedPositions = positions.map(pos => 
        pos.id === editingPositionId ? { 
          ...newPosition, 
          id: editingPositionId,
          deadline: formattedDeadline 
        } as PositionType : pos
      );
      setPositions(updatedPositions);
      toast({
        title: "Position Updated",
        description: `${newPosition.title} has been updated successfully.`,
      });
    } else {
      const newId = positions.length > 0 ? Math.max(...positions.map(p => p.id)) + 1 : 1;
      const positionToAdd = { 
        ...newPosition, 
        id: newId,
        active: true,
        deadline: formattedDeadline
      } as PositionType;
      
      setPositions([...positions, positionToAdd]);
      toast({
        title: "Position Added",
        description: `${newPosition.title} has been added successfully.`,
      });
    }

    setNewPosition({
      title: '',
      description: '',
      requirements: [],
      type: positionTab,
      active: true
    });
    setDeadlineDate(new Date());
    setEditingPositionId(null);
  };

  const handleEditPosition = (position: PositionType) => {
    setNewPosition(position);
    setEditingPositionId(position.id);
    setPositionTab(position.type);
    
    if (position.deadline) {
      setDeadlineDate(new Date(position.deadline));
    } else {
      setDeadlineDate(new Date());
    }
  };

  const handleDeletePosition = (id: number) => {
    const updatedPositions = positions.filter(pos => pos.id !== id);
    setPositions(updatedPositions);
    
    if (editingPositionId === id) {
      setNewPosition({
        title: '',
        description: '',
        requirements: [],
        type: positionTab,
        active: true
      });
      setEditingPositionId(null);
    }

    toast({
      title: "Position Deleted",
      description: "The position has been removed.",
    });
  };

  const handleToggleActive = (id: number) => {
    const updatedPositions = positions.map(pos => 
      pos.id === id ? { ...pos, active: !pos.active } : pos
    );
    setPositions(updatedPositions);
  };

  const formatCountdown = (deadlineStr: string | undefined) => {
    if (!deadlineStr) return "No deadline set";
    
    const deadline = new Date(deadlineStr);
    if (!isFuture(deadline)) return "Application closed";
    
    const days = differenceInDays(deadline, new Date());
    const hours = differenceInHours(deadline, new Date()) % 24;
    const minutes = differenceInMinutes(deadline, new Date()) % 60;
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const filteredPositions = positions.filter(pos => pos.type === positionTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <AdminAuth>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="heading-lg text-volt-dark mb-6">Admin Dashboard</h1>
              
              <Tabs defaultValue="applications" className="w-full" onValueChange={(value) => setActiveTab(value as 'applications' | 'positions')}>
                <TabsList className="mb-6">
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="positions">Manage Positions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="applications">
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
                </TabsContent>
                
                <TabsContent value="positions">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <Tabs defaultValue="volt" onValueChange={(value) => setPositionTab(value as 'volt' | 'project')}>
                        <TabsList className="mb-4">
                          <TabsTrigger value="volt">Volt Positions</TabsTrigger>
                          <TabsTrigger value="project">Project Positions</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="volt">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">
                              {editingPositionId !== null ? 'Edit Volt Position' : 'Add New Volt Position'}
                            </h3>
                            
                            <div>
                              <Label htmlFor="title">Position Title*</Label>
                              <Input
                                id="title"
                                value={newPosition.title || ''}
                                onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
                                placeholder="e.g., Technology Consultant"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="description">Position Description*</Label>
                              <Textarea
                                id="description"
                                value={newPosition.description || ''}
                                onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
                                placeholder="Describe the position and responsibilities"
                                rows={4}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="deadline">Application Deadline*</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id="deadline"
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !deadlineDate && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={deadlineDate}
                                    onSelect={setDeadlineDate}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div>
                              <Label>Requirements</Label>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={reqInput}
                                  onChange={(e) => setReqInput(e.target.value)}
                                  placeholder="e.g., Strong analytical skills"
                                  className="flex-1"
                                />
                                <Button 
                                  type="button"
                                  size="sm"
                                  onClick={handleAddRequirement}
                                >
                                  <Plus size={16} />
                                </Button>
                              </div>
                              
                              <div className="mt-2 space-y-2">
                                {newPosition.requirements?.map((req, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span>{req}</span>
                                    <button 
                                      onClick={() => handleRemoveRequirement(idx)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-4">
                              <Button onClick={handleSavePosition} className="w-full">
                                {editingPositionId !== null ? 'Update Position' : 'Add Position'}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="project">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">
                              {editingPositionId !== null ? 'Edit Project Position' : 'Add New Project Position'}
                            </h3>
                            
                            <div>
                              <Label htmlFor="companyName">Company Name*</Label>
                              <Input
                                id="companyName"
                                value={newPosition.companyName || ''}
                                onChange={(e) => setNewPosition({...newPosition, companyName: e.target.value})}
                                placeholder="e.g., Company X"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="projectDescription">Project Description*</Label>
                              <Textarea
                                id="projectDescription"
                                value={newPosition.projectDescription || ''}
                                onChange={(e) => setNewPosition({...newPosition, projectDescription: e.target.value})}
                                placeholder="Describe the project"
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="title">Position Title*</Label>
                              <Input
                                id="title"
                                value={newPosition.title || ''}
                                onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
                                placeholder="e.g., Data Scientist"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="description">Position Description*</Label>
                              <Textarea
                                id="description"
                                value={newPosition.description || ''}
                                onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
                                placeholder="Describe the position and responsibilities"
                                rows={3}
                              />
                            </div>

                            <div>
                              <Label htmlFor="deadline">Application Deadline*</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id="deadline"
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !deadlineDate && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={deadlineDate}
                                    onSelect={setDeadlineDate}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div>
                              <Label>Preferred Majors</Label>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={majorInput}
                                  onChange={(e) => setMajorInput(e.target.value)}
                                  placeholder="e.g., Computer Science"
                                  className="flex-1"
                                />
                                <Button 
                                  type="button"
                                  size="sm"
                                  onClick={handleAddMajor}
                                >
                                  <Plus size={16} />
                                </Button>
                              </div>
                              
                              <div className="mt-2 space-y-2">
                                {newPosition.preferredMajors?.map((major, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span>{major}</span>
                                    <button 
                                      onClick={() => handleRemoveMajor(idx)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-4">
                              <Button onClick={handleSavePosition} className="w-full">
                                {editingPositionId !== null ? 'Update Position' : 'Add Position'}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-4">
                        {positionTab === 'volt' ? 'Volt Positions' : 'Project Positions'}
                      </h3>
                      
                      {filteredPositions.length > 0 ? (
                        <div className="space-y-4">
                          {filteredPositions.map(position => (
                            <div key={position.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-lg">{position.title}</h4>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleToggleActive(position.id)}
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      position.active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {position.active ? 'Active' : 'Inactive'}
                                  </button>
                                  <button
                                    onClick={() => handleEditPosition(position)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeletePosition(position.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{position.description}</p>
                              
                              {positionTab === 'project' && position.companyName && (
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">Company:</span> {position.companyName}
                                </div>
                              )}

                              <div className="flex items-center mt-2 text-sm">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="font-medium mr-2">Application deadline:</span>
                                {position.deadline ? (
                                  <>
                                    <span className="text-gray-500 mr-2">
                                      {format(new Date(position.deadline), "PPP")}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      isPast(new Date(position.deadline)) 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {formatCountdown(position.deadline)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-gray-500">Not set</span>
                                )}
                              </div>
                              
                              {position.requirements && position.requirements.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-sm font-medium">Requirements: </span>
                                  <span className="text-sm text-gray-500">
                                    {position.requirements.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <p className="text-gray-500">No positions added yet.</p>
                          <p className="text-gray-400 text-sm">Create a new position using the form on the left.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {selectedApplication && activeTab === 'applications' && (
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
                      {selectedApplication.details.email && (
                        <div>
                          <p className="text-gray-500 text-sm">Email</p>
                          <p>{selectedApplication.details.email}</p>
                        </div>
                      )}
                      {selectedApplication.details.phoneNumber && (
                        <div>
                          <p className="text-gray-500 text-sm">Phone Number</p>
                          <p>{selectedApplication.details.phoneNumber}</p>
                        </div>
                      )}
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
          </AdminAuth>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
