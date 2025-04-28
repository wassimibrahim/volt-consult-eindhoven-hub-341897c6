import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ContactMessage } from '@/services/supabaseService';

interface MessageModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal = ({ message, isOpen, onClose }: MessageModalProps) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Message from {message.name}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Received on {message.date ? format(new Date(message.date), 'PPP') : 'Unknown date'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="text-sm">{message.email}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Message</h4>
            <div className="mt-1 rounded-md bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-sm">{message.message}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
