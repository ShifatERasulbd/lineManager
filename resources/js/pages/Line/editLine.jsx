import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import EditForm from '@/components/line/editForm';
import { useAppContext } from '@/context/AppContext';

import { fetchLine, updateLine } from './api';

const initialForm = {
    line_number: '',
   
};

export default function EditLine() {
    const { id } = useParams();
    const lineId = Number(id);
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        setPageTitle('Edit Line');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        if (!Number.isInteger(lineId) || lineId <= 0) {
            setLoadError('Invalid line id.');
            setIsLoading(false);
            return;
        }

        async function loadData() {
            setIsLoading(true);
            setLoadError('');

            try {
                const line = await fetchLine(lineId);

                if (!ignore) {
                    setForm({
                        line_number: line?.line_number || '',
                    });
                }
            } catch (error) {
                if (!ignore) {
                    setLoadError(error.message || 'Failed to load line.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            ignore = true;
        };
    }, [lineId]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'avatar') {
            const file = files?.[0] || null;
            const preview = file ? URL.createObjectURL(file) : (form.avatar_preview || '');
            setForm((previous) => ({ ...previous, avatar: file, avatar_preview: preview }));
        } else {
            setForm((previous) => ({ ...previous, [name]: value }));
        }
        setErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsSubmitting(true);
        setErrors({});
        setLoadError('');

        try {
            const payload = {
                line_number: form.line_number.trim(),
            };

            await updateLine(lineId, payload);

            toast.success('Line updated successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/lines');
        } catch (error) {
            setErrors(error.payload?.errors || {});
            if (!error.payload?.errors) {
                const message = error.message || 'Failed to update line.';
                setLoadError(message);
                toast.error(message, { style: { color: '#dc2626' } });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Loading line...</p>;
    }

    return (
        <div className="space-y-4">
            {loadError && <p className="text-sm text-destructive">{loadError}</p>}

            <EditForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/lines')}
                isSubmitting={isSubmitting}
                errors={errors}
                submitLabel="Update Line"
                submittingLabel="Updating..."
            />
        </div>
    );
}