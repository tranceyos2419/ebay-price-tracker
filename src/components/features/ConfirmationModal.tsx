"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto rounded-lg shadow-xl border border-gray-200 bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 text-center  py-2 px-4 rounded-md shadow-md">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-gray-700 text-center text-base px-6 py-4 bg-gray-50 border border-gray-300 rounded-md shadow-sm">
            {message}
          </p>
        </div>
        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-24 py-2 text-gray-700 border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 shadow-sm cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-24 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 shadow-sm cursor-pointer"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
