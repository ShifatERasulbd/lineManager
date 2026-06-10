import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * LineMultiSelect
 * @param {Array}    lines    - full list: [{ id, line_number }]
 * @param {Array}    value    - array of selected line ids (numbers)
 * @param {Function} onChange - called with the new array of ids
 * @param {boolean}  disabled
 */
export default function LineMultiSelect({ lines = [], value = [], onChange, disabled = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggle = (id) => {
        const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
        onChange(next);
    };

    const displayLabel =
        value.length === 0
            ? 'Select lines...'
            : value.length === lines.length && lines.length > 0
            ? 'All lines selected'
            : `${value.length} line${value.length > 1 ? 's' : ''} selected`;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className={value.length === 0 ? 'text-muted-foreground' : ''}>{displayLabel}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="max-h-48 overflow-y-auto p-1">
                        {lines.length === 0 && (
                            <p className="py-2 text-center text-xs text-muted-foreground">No lines available.</p>
                        )}
                        {lines.map((line) => {
                            const checked = value.includes(line.id);
                            return (
                                <label
                                    key={line.id}
                                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent select-none"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-input accent-primary"
                                        checked={checked}
                                        disabled={disabled}
                                        onChange={() => toggle(line.id)}
                                    />
                                    <span className="text-sm">{line.line_number}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
