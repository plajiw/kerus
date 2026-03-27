import { useState, useCallback, useEffect } from 'react';
import { Sheet } from '../types';
import { toISODate } from '../utils/dateUtils';
import { SAMPLE_RECIPES } from '../constants/sampleData';

export const useSheets = () => {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [sheetsSelection, setSheetsSelection] = useState<string[]>([]);
    const [sheetsFilterStart, setSheetsFilterStart] = useState('');
    const [sheetsFilterEnd, setSheetsFilterEnd] = useState('');

    useEffect(() => {
        const savedSheets = localStorage.getItem('ficha_tecnica_history');
        if (savedSheets) {
            setSheets(JSON.parse(savedSheets));
        } else {
            // First run - inject sample data
            setSheets(SAMPLE_RECIPES);
            localStorage.setItem('ficha_tecnica_history', JSON.stringify(SAMPLE_RECIPES));
        }
    }, []);

    useEffect(() => {
        setSheetsSelection((prev) => prev.filter((id) => sheets.some((sheet) => sheet.id === id)));
    }, [sheets]);

    const saveSheet = useCallback((sheet: Sheet) => {
        const updated = [sheet, ...sheets.filter(h => h.id !== sheet.id)];
        setSheets(updated);
        localStorage.setItem('ficha_tecnica_history', JSON.stringify(updated));
    }, [sheets]);

    // Backwards compatibility alias (Phase 1)
    const saveToHistory = saveSheet;

    const deleteSheet = (id: string) => {
        const updated = sheets.filter(h => h.id !== id);
        setSheets(updated);
        localStorage.setItem('ficha_tecnica_history', JSON.stringify(updated));
    };

    // Backwards compatibility alias (Phase 1)
    const deleteRecipe = deleteSheet;

    const toggleSheetsSelection = (id: string) => {
        setSheetsSelection((prev) => (
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        ));
    };

    // Backwards compatibility alias (Phase 1)
    const toggleHistorySelection = toggleSheetsSelection;

    const clearSheetsSelection = () => {
        setSheetsSelection([]);
    };

    // Backwards compatibility alias (Phase 1)
    const clearHistorySelection = clearSheetsSelection;

    const filteredSheets = sheets.filter((sheet) => {
        if (!sheetsFilterStart && !sheetsFilterEnd) return true;
        const sheetDate = toISODate(sheet.data);
        const isIso = /^\d{4}-\d{2}-\d{2}$/.test(sheetDate);
        if (!isIso) return false;
        if (sheetsFilterStart && sheetDate < sheetsFilterStart) return false;
        if (sheetsFilterEnd && sheetDate > sheetsFilterEnd) return false;
        return true;
    });

    // Backwards compatibility alias (Phase 1)
    const filteredHistory = filteredSheets;

    const getSelectedSheets = () => {
        return sheets.filter((sheet) => sheetsSelection.includes(sheet.id));
    };

    // Backwards compatibility alias (Phase 1)
    const getSelectedRecipes = getSelectedSheets;

    return {
        sheets,
        history: sheets, // Backwards compat
        sheetsSelection,
        historySelection: sheetsSelection, // Backwards compat
        sheetsFilterStart,
        historyFilterStart: sheetsFilterStart, // Backwards compat
        setSheetsFilterStart,
        setHistoryFilterStart: setSheetsFilterStart, // Backwards compat
        sheetsFilterEnd,
        historyFilterEnd: sheetsFilterEnd, // Backwards compat
        setSheetsFilterEnd,
        setHistoryFilterEnd: setSheetsFilterEnd, // Backwards compat
        saveSheet,
        saveToHistory, // Backwards compat
        deleteSheet,
        deleteRecipe, // Backwards compat
        toggleSheetsSelection,
        toggleHistorySelection, // Backwards compat
        clearSheetsSelection,
        clearHistorySelection, // Backwards compat
        filteredSheets,
        filteredHistory, // Backwards compat
        getSelectedSheets,
        getSelectedRecipes // Backwards compat
    };
};

// Backwards compatibility export (Phase 1)
export const useHistory = useSheets;
