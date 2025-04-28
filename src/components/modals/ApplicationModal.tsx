
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Application } from "@/types/models";

interface ApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationModal = ({ application, isOpen, onClose }: ApplicationModalProps) => {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Applicant</h4>
            <p>{application.fullName}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Email</h4>
            <p>{application.email}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Position</h4>
            <p>{application.position}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Status</h4>
            <p className="capitalize">{application.status}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Documents</h4>
            <div className="space-y-2">
              <a 
                href={application.cv} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                View CV
              </a>
              <a 
                href={application.motivationLetter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                View Motivation Letter
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold">Applied On</h4>
            <p>{new Date(application.date).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
