
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Message } from "@/types/models";

interface MessageModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal = ({ message, isOpen, onClose }: MessageModalProps) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">From</h4>
            <p>{message.name}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Email</h4>
            <p>{message.email}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Message</h4>
            <p className="whitespace-pre-wrap">{message.message}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Received On</h4>
            <p>{new Date(message.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
