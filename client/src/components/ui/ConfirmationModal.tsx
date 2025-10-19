import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
    /** Controls the visibility of the dialog. */
    open: boolean;
    /** Function to call when the dialog should be closed (e.g., user clicks cancel or backdrop). */
    onClose: () => void;
    /** Function to call when the user confirms the action. */
    onConfirm: () => void;
    /** Title text for the dialog header. */
    title: string;
    /** Descriptive text about the action being confirmed. */
    description: string;
    /** Boolean to disable buttons while an action (mutation) is pending. */
    isSubmitting: boolean;
    /** Text for the confirmation button (e.g., 'Delete Permanently'). */
    confirmText?: string;
}

/**
 * @component ConfirmModal
 * A reusable modal component for prompting the user for confirmation before an irreversible action.
 */
export const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    isSubmitting,
    confirmText = 'Confirm',
}: ConfirmModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-destructive flex items-center">
                        <Trash2 className="h-5 w-5 mr-2" /> {title}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
                
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};