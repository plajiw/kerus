import { useState, useCallback } from 'react';

const STORAGE_KEY = 'kerus_favorites';

const loadFavorites = (): Set<string> => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return new Set();
        return new Set<string>(JSON.parse(raw) as string[]);
    } catch {
        return new Set();
    }
};

const saveFavorites = (ids: Set<string>): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
};

export const useFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(loadFavorites);

    const toggleFavorite = useCallback((id: string) => {
        setFavoriteIds(prev => {
            const next = new Set<string>(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            saveFavorites(next);
            return next;
        });
    }, []);

    const isFavorite = useCallback((id: string): boolean => {
        return favoriteIds.has(id);
    }, [favoriteIds]);

    return { favoriteIds, toggleFavorite, isFavorite };
};
