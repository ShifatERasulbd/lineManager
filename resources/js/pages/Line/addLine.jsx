import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AddForm from '@/components/line/addForm';
import { useAppContext } from '@/context/AppContext';

import { createLine } from './api';

const initialForm = {
   line_number: '',
};

function validateForm(form) {
    const errors = {};

    if (!form.line_number.trim()) {
        errors.line_number = ['The line number field is required.'];
    }
    return errors;
}

export default function AddLine() {
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestError, setRequestError] = useState('');

    useEffect(() => {
        setPageTitle('Add Line');
    }, [setPageTitle]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

  

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validateForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setRequestError('');
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setRequestError('');

        try {
            await createLine({
                line_number: form.line_number.trim(),
            });
                

            toast.success('Line created successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/lines');
        } catch (error) {
            setErrors(error.payload?.errors || {});
            if (!error.payload?.errors) {
                const message = error.message || 'Failed to create line.';
                setRequestError(message);
                toast.error(message, { style: { color: '#dc2626' } });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            {requestError && <p className="text-sm text-destructive">{requestError}</p>}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <AddForm
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/lines')}
                    isSubmitting={isSubmitting}
                    errors={errors}
                   
                />
            </div>
        </div>
    );
}


