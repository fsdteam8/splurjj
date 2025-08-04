// components/ConfirmationModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Yes",
  cancelText = "No",
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-black">{title}</DialogTitle>
          <DialogDescription className="text-black dark:text-black">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="text-black border border-black dark:text-black" variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button className="text-white dark:text-white border border-red-500 bg-red-500 hover:bg-red-700" variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
