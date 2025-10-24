import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from '../ui/button';

interface GenericAlertModalProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GenericAlertModal: FC<GenericAlertModalProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  isOpen = false,
  setIsOpen,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDisabled = false,
}) => {
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const handleConfirm = async () => {
    setIsConfirmLoading(true);
    try {
      await onConfirm();
      setIsOpen?.(false);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={isConfirmLoading || isDisabled}>
            {isConfirmLoading && <Loader2 className="size-4 animate-spin" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
