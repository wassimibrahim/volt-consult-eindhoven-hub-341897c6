import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Mail, Phone, User, Briefcase } from 'lucide-react';
import { ApplicationType } from '@/services/supabaseService';
import { format } from 'date-fns';

interface ApplicationModalProps {
  application: ApplicationType | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => void;
}

const ApplicationModal = ({ application, isOpen, onClose, onStatusChange }: ApplicationModalProps) => {
  if (!application) return null;

  const handleStatusChange = (status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    if (onStatusChange) {
      onStatusChange(application.id, status);
    }
  };

  const handleDocumentDownload = (docIndex: number) => {
    if (application.documentData && application.documentData[docIndex]) {
      const link = document.createElement('a');
      link.href = application.documentData[docIndex];
      link.download = `${application.documents[docIndex]}_${application.fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Application Details</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{application.fullName}</h2>
            <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{application.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{application.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Application Date</p>
                    <p className="font-medium">{format(new Date(application.date), 'PPP')}</p>
                  </div>
                </div>
                
                {application.details && (
                  <>
                    {application.details.birthDate && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Birth Date</p>
                          <p className="font-medium">{format(new Date(application.details.birthDate), 'PPP')}</p>
                        </div>
                      </div>
                    )}
                    
                    {application.details.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium">{application.details.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mt-6 mb-4">Academic Information</h3>
              
              {application.details && (
                <div className="space-y-4">
                  {application.details.degreeProgram && (
                    <div>
                      <p className="text-sm text-gray-500">Degree Program</p>
                      <p className="font-medium">{application.details.degreeProgram}</p>
                    </div>
                  )}
                  
                  {application.details.yearOfStudy && (
                    <div>
                      <p className="text-sm text-gray-500">Year of Study</p>
                      <p className="font-medium">{application.details.yearOfStudy}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Application Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{application.position}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Application Type</p>
                  <p className="font-medium capitalize">{application.type}</p>
                </div>
                
                {application.details && application.details.linkedinProfile && (
                  <div>
                    <p className="text-sm text-gray-500">LinkedIn Profile</p>
                    <a 
                      href={application.details.linkedinProfile} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {application.details.linkedinProfile}
                    </a>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mt-6 mb-4">Documents</h3>
              
              <div className="space-y-3">
                {application.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between border p-3 rounded bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <span>{doc}</span>
                    </div>
                    {application.documentData && application.documentData[idx] && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDocumentDownload(idx)}
                      >
                        Download
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {onStatusChange && (
            <div className="mt-8 border-t pt-4">
              <h3 className="font-semibold mb-3">Update Application Status</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={application.status === 'pending' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('pending')}
                >
                  Pending
                </Button>
                <Button 
                  variant={application.status === 'reviewed' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('reviewed')}
                >
                  Reviewed
                </Button>
                <Button 
                  variant={application.status === 'accepted' ? 'default' : 'outline'} 
                  size="sm"
                  className={application.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}
                  onClick={() => handleStatusChange('accepted')}
                >
                  Accept
                </Button>
                <Button 
                  variant={application.status === 'rejected' ? 'default' : 'outline'} 
                  size="sm"
                  className={application.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                  onClick={() => handleStatusChange('rejected')}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
