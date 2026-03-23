import { useState, useCallback, useRef } from 'react';

interface AsyncState<T> {
    loading: boolean;
    error: string | null;
    data: T | null;
}

interface UseAsyncReturn<T> {
    loading: boolean;
    error: string | null;
    data: T | null;
    /** Wrap any async function. Returns the result or null on error. */
    run: (fn: () => Promise<T>) => Promise<T | null>;
    /** Clear error state */
    reset: () => void;
}

/**
 * Per-component async state tracker.
 *
 * Usage:
 *   const { loading, error, run } = useAsync<Recipe>()
 *   const result = await run(() => fetchRecipe(id))
 *
 * When the backend API is wired up, swap the `fn` body — no other changes needed.
 */
export function useAsync<T = unknown>(): UseAsyncReturn<T> {
    const [state, setState] = useState<AsyncState<T>>({ loading: false, error: null, data: null });
    const mountedRef = useRef(true);

    // track mounted state to prevent setState after unmount
    useState(() => {
        return () => { mountedRef.current = false; };
    });

    const run = useCallback(async (fn: () => Promise<T>): Promise<T | null> => {
        setState(s => ({ ...s, loading: true, error: null }));
        try {
            const result = await fn();
            if (mountedRef.current) {
                setState({ loading: false, error: null, data: result });
            }
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (mountedRef.current) {
                setState(s => ({ ...s, loading: false, error: message }));
            }
            return null;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ loading: false, error: null, data: null });
    }, []);

    return { loading: state.loading, error: state.error, data: state.data, run, reset };
}
