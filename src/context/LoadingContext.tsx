import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────
interface LoadingOp {
    id: string;
    label?: string;
}

interface LoadingContextValue {
    /** True when at least one global operation is in progress */
    isWaiting: boolean;
    /** Label of the most recently started operation (for the overlay) */
    waitLabel: string | undefined;
    /**
     * Wrap any Promise with a global loading overlay.
     *
     * @example
     * const result = await displayWaiting(saveToApi(data), 'Salvando...')
     *
     * When the backend is wired: replace the promise body, keep the call site.
     */
    displayWaiting: <T>(promise: Promise<T>, label?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const useLoading = (): LoadingContextValue => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
    return ctx;
};

// ─── Provider ──────────────────────────────────────────────────
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ops, setOps] = useState<LoadingOp[]>([]);
    const counterRef = useRef(0);

    const displayWaiting = useCallback(<T,>(promise: Promise<T>, label?: string): Promise<T> => {
        const id = `op_${++counterRef.current}`;
        setOps(prev => [...prev, { id, label }]);

        return promise.finally(() => {
            setOps(prev => prev.filter(op => op.id !== id));
        });
    }, []);

    const isWaiting = ops.length > 0;
    const waitLabel = ops.length > 0 ? ops[ops.length - 1].label : undefined;

    return (
        <LoadingContext.Provider value={{ isWaiting, waitLabel, displayWaiting }}>
            {children}
            {isWaiting && <LoadingOverlay label={waitLabel} />}
        </LoadingContext.Provider>
    );
};

// ─── Overlay ───────────────────────────────────────────────────
const LoadingOverlay: React.FC<{ label?: string }> = ({ label }) => (
    <div className="loading-overlay" role="status" aria-live="polite">
        <div className="loading-card">
            <div className="loading-spinner" />
            <p
                style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--ink-1)',
                    letterSpacing: '0.02em',
                }}
            >
                {label ?? 'Aguarde...'}
            </p>
        </div>
    </div>
);
