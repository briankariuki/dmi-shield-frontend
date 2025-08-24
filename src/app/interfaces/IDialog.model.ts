export type ConfirmationDialogData = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'confirm' | 'alert' | 'info' | 'danger';
};
