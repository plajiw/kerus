import React from 'react';
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import type { Toast, ToastType } from '../../hooks/useToast';

const ICONS: Record<ToastType, React.FC<{ size: number; className: string }>> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const STYLES: Record<ToastType, React.CSSProperties> = {
    success: { background: 'var(--status-success-bg)', color: 'var(--status-success-text)' },
    error:   { background: 'var(--status-error-bg)',   color: 'var(--status-error-text)'   },
    warning: { background: 'var(--status-warning-bg)', color: 'var(--status-warning-text)' },
    info:    { background: 'var(--status-info-bg)',    color: 'var(--status-info-text)'    },
};

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map(toast => {
                const Icon = ICONS[toast.type];
                return (
                    <div
                        key={toast.id}
                        className="flex items-start gap-3 p-4 rounded-xl pointer-events-auto animate-in slide-in-from-right-4 duration-300"
                        style={STYLES[toast.type]}
                    >
                        <Icon size={16} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
                        <button
                            onClick={() => onRemove(toast.id)}
                            className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                            aria-label="Fechar"
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
