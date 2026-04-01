import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@moum-zip/ui/components";

interface AlertModalProps {
  open: boolean;
  message: string;
  description?: string;
  onCancel: () => void;
  onAction: () => void;
}

export const AlertModal = ({ open, message, description, onCancel, onAction }: AlertModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{message}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
