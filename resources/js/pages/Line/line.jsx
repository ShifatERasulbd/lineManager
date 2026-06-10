import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppContext } from '@/context/AppContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import LineTable from '@/components/line/table';

import { deleteLine, fetchLines } from './api';

export default function Lines() {
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();
    const [lines, setLines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [lineToDelete, setLineToDelete] = useState(null);
    const canCreate = true;
    const canUpdate = true;
    const canDelete = true;

    useEffect(() => {
        setPageTitle('Lines');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadLines() {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const data = await fetchLines();
                if (!ignore) {
                    setLines(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(error.message || 'Failed to load lines.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadLines();

        return () => {
            ignore = true;
        };
    }, []);

    const handleConfirmDelete = async () => {
        if (!lineToDelete) {
            return;
        }

        const id = lineToDelete.id;
        setDeletingId(id);
        setErrorMessage('');

        try {
            await deleteLine(id);
            setLines((previous) => (Array.isArray(previous) ? previous : []).filter((line) => line.id !== id));
            toast.success('Line deleted successfully.', {
                style: { color: '#16a34a' },
            });
            setLineToDelete(null);
        } catch (error) {
            const message = error.message || 'Failed to delete line.';
            setErrorMessage(message);
            toast.error(message, {
                style: { color: '#dc2626' },
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
           <div className="space-y-5">
                {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <LineTable
                    lines={lines}
                    isLoading={isLoading}
                    deletingId={deletingId}
                    onAdd={() => navigate('/lines/add')}
                    onEdit={(id) => navigate(`/lines/${id}/edit`)}
                    onRequestDelete={setLineToDelete}
                    canCreate={canCreate}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                />
                </div>

                <AlertDialog
                    open={Boolean(lineToDelete)}
                    onOpenChange={(open) => !open && setLineToDelete(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Line</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete {lineToDelete?.name}? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deletingId !== null}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                variant="destructive"
                                disabled={deletingId !== null}
                                onClick={handleConfirmDelete}
                            >
                                {deletingId !== null ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
           </div>
        </>
    );
}