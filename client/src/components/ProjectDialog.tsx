import { useState, useEffect } from 'react';
import { Project } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

// Define the precise type for the data being saved/updated
type SaveProjectData = {
    id?: string;
    name: string;
    description: string;
};

// FIX 1: Simplify the onSave signature to only omit 'createdAt' and accept the ID.
interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // The input argument is the SAVE data, which must be async as it triggers mutations
    onSave: (project: SaveProjectData) => Promise<void>; 
    project?: Project | null;
    isSaving: boolean; // Assuming this prop exists to disable the button
}

export const ProjectDialog = ({
    open,
    onOpenChange,
    onSave,
    project,
    isSaving // Destructure the new prop
}: ProjectDialogProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description);
        } else {
            setName('');
            setDescription('');
        }
    }, [project, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // The save handler is ASYNC, so we await it
        await onSave({
            id: project?.id,
            name,
            description,
        });
        // onOpenChange(false); // Let the Dashboard handle closing after save success/failure
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {project ? 'Edit Project' : 'Create New Project'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter project name"
                                required
                                disabled={isSaving}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter project description"
                                rows={4}
                                required
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary" disabled={isSaving}>
                            {isSaving ? (
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            ) : (
                                project ? 'Update' : 'Create'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};