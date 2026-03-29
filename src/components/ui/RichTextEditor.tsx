import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Eraser } from 'lucide-react';
import { isRichTextEmpty } from '../../utils/richTextUtils';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minRows?: number;
}

type Cmd = 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'insertUnorderedList' | 'insertOrderedList' | 'removeFormat';

const TOOLBAR: { cmd: Cmd; icon: React.ReactNode; title: string }[] = [
    { cmd: 'bold',                 icon: <Bold size={13} />,          title: 'Negrito (Ctrl+B)' },
    { cmd: 'italic',               icon: <Italic size={13} />,        title: 'Itálico (Ctrl+I)' },
    { cmd: 'underline',            icon: <Underline size={13} />,     title: 'Sublinhado (Ctrl+U)' },
    { cmd: 'strikeThrough',        icon: <Strikethrough size={13} />, title: 'Tachado' },
];

const LIST_TOOLS: { cmd: Cmd; icon: React.ReactNode; title: string }[] = [
    { cmd: 'insertUnorderedList', icon: <List size={13} />,        title: 'Lista com marcadores' },
    { cmd: 'insertOrderedList',   icon: <ListOrdered size={13} />, title: 'Lista numerada' },
];

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = '',
    minRows = 5,
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const lastValueRef = useRef<string>(value);
    const [active, setActive] = useState<Set<string>>(new Set());
    const [focused, setFocused] = useState(false);

    // Set initial innerHTML on mount
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value || '';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync when value changes externally (loading a recipe)
    useEffect(() => {
        if (editorRef.current && value !== lastValueRef.current) {
            editorRef.current.innerHTML = value || '';
            lastValueRef.current = value;
        }
    }, [value]);

    const syncState = useCallback(() => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        const normalised = isRichTextEmpty(html) ? '' : html;
        lastValueRef.current = normalised;
        onChange(normalised);
        // update active formats
        const next = new Set<string>();
        try {
            if (document.queryCommandState('bold'))               next.add('bold');
            if (document.queryCommandState('italic'))             next.add('italic');
            if (document.queryCommandState('underline'))          next.add('underline');
            if (document.queryCommandState('strikeThrough'))      next.add('strikeThrough');
            if (document.queryCommandState('insertUnorderedList')) next.add('insertUnorderedList');
            if (document.queryCommandState('insertOrderedList'))  next.add('insertOrderedList');
        } catch {}
        setActive(next);
    }, [onChange]);

    const execCmd = useCallback((cmd: Cmd) => {
        document.execCommand(cmd, false);
        editorRef.current?.focus();
        syncState();
    }, [syncState]);

    const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        const text = event.clipboardData.getData('text/plain');
        if (!text) return;
        const html = escapeHtml(text).replace(/\r?\n/g, '<br>');
        document.execCommand('insertHTML', false, html);
        syncState();
    }, [syncState]);

    const minHeight = `${minRows * 1.55}rem`;

    const btnStyle = (cmd: Cmd) => ({
        color: active.has(cmd) ? 'var(--primary)' : 'var(--ink-1)',
        background: active.has(cmd) ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
    });

    return (
        <div
            className="rounded-xl overflow-hidden transition-all"
            style={{
                outline: focused ? `2px solid var(--primary)` : '2px solid transparent',
                outlineOffset: '-1px',
                background: 'var(--surface-3)',
            }}
        >
            {/* ── Toolbar ─────────────────────────────────────── */}
            <div
                className="flex items-center gap-0.5 px-2 py-1.5 flex-wrap"
                style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-3)' }}
                onMouseDown={e => e.preventDefault()}
            >
                {TOOLBAR.map(({ cmd, icon, title }) => (
                    <button
                        key={cmd}
                        type="button"
                        onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                        className="w-7 h-7 flex items-center justify-center rounded transition-all"
                        style={btnStyle(cmd)}
                        title={title}
                    >
                        {icon}
                    </button>
                ))}

                <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: 'var(--border)' }} />

                {LIST_TOOLS.map(({ cmd, icon, title }) => (
                    <button
                        key={cmd}
                        type="button"
                        onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                        className="w-7 h-7 flex items-center justify-center rounded transition-all"
                        style={btnStyle(cmd)}
                        title={title}
                    >
                        {icon}
                    </button>
                ))}

                <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: 'var(--border)' }} />

                <button
                    type="button"
                    onMouseDown={e => { e.preventDefault(); execCmd('removeFormat'); }}
                    className="w-7 h-7 flex items-center justify-center rounded transition-all"
                    style={{ color: 'var(--ink-2)', background: 'transparent' }}
                    title="Remover formatação"
                >
                    <Eraser size={12} />
                </button>
            </div>

            {/* ── Editable area ───────────────────────────────── */}
            <div className="relative" style={{ background: 'var(--surface-2)' }}>
                {isRichTextEmpty(value) && !focused && (
                    <div
                        className="absolute inset-0 p-4 text-sm pointer-events-none select-none"
                        style={{ color: 'var(--ink-2)' }}
                    >
                        {placeholder}
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="rte-editor outline-none text-sm p-4 overflow-auto"
                    style={{ minHeight, color: 'var(--ink-0)', lineHeight: '1.75' }}
                    onInput={syncState}
                    onKeyUp={syncState}
                    onMouseUp={syncState}
                    onFocus={() => setFocused(true)}
                    onBlur={() => { setFocused(false); syncState(); }}
                    onPaste={handlePaste}
                />
            </div>
        </div>
    );
};
