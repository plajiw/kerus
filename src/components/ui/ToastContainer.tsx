import React from 'react';
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import type { Toast, ToastType } from '../../hooks/useToast';

const ICONS: Record<ToastType, React.FC<{ size: number; className: string }>> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const STYLES: Record<ToastType, string> = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

const ICON_COLORS: Record<ToastType, string> = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
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
                        className={`flex items-start gap-3 p-4 rounded-xl border pointer-events-auto animate-in slide-in-from-right-4 duration-300 ${STYLES[toast.type]}`}
                    >
                        <Icon size={16} className={`mt-0.5 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
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
