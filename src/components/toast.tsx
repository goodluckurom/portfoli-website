import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const toast = ({ title, message, type = 'info' }: ToastProps) => {
  switch (type) {
    case 'success':
      sonnerToast.success(title || 'Success', {
        description: message,
      });
      break;
    case 'error':
      sonnerToast.error(title || 'Error', {
        description: message,
      });
      break;
    default:
      sonnerToast(title || 'Info', {
        description: message,
      });
  }
};
