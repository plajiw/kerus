import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, FileCode2, FileJson, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useAdvancedMode } from '../../hooks/useAdvancedMode';
import { CodeBlock } from '../ui/CodeBlock';
import { HintButton } from '../ui/HintButton';
import { Recipe } from '../../types';
import { isoToday } from '../../utils/dateUtils';
import { parseXMLString } from '../../services/xmlService';

export type ImportType = 'json' | 'xml';

interface ImportModalProps {
    type: ImportType;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (recipe: Recipe) => void;
    onError: (msg?: string) => void;
    sanitizeRecipe: (recipe: Recipe) => Recipe;
}

// ─── Templates ────────────────────────────────────────────────
const JSON_TEMPLATE = `{
  "nome_formula": "Nome da Fórmula",
  "nome_empresa": "Nome da Empresa",
  "data": "${isoToday()}",
  "ingredientes": [
    {
      "nome": "Ingrediente",
      "quantidade": 100,
      "unidade": "KG"
    }
  ],
  "modo_preparo": [
    { "text": "Descreva o passo aqui" }
  ],
  "observacoes": "Observações opcionais"
}`;

const XML_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<recipe>
  <name>Nome da Fórmula</name>
  <date>${isoToday()}</date>
  <ingredients>
    <ingredient>
      <name>Ingrediente</name>
      <quantity>100</quantity>
      <unit>KG</unit>
    </ingredient>
  </ingredients>
  <steps>
    <step>
      <text>Descreva o passo aqui</text>
    </step>
  </steps>
  <notes>Observações opcionais</notes>
</recipe>`;

// ─── JSON parsing ─────────────────────────────────────────────
const parseJsonText = (raw: string, sanitize: (r: Recipe) => Recipe): Recipe => {
    const parsed = JSON.parse(raw);
    const ingredientes = Array.isArray(parsed.ingredientes) ? parsed.ingredientes : [];
    const modoRaw = Array.isArray(parsed.modo_preparo) ? parsed.modo_preparo : [];
    const recipe: Recipe = {
        id: crypto.randomUUID(),
        nome_formula: String(parsed.nome_formula || '').trim(),
        nome_empresa: String(parsed.empresa_responsavel || parsed.nome_empresa || '').trim(),
        data: String(parsed.data || isoToday()),
        ingredientes: ingredientes.map((ing: any) => ({
            id: crypto.randomUUID(),
            nome: String(ing?.nome || '').trim(),
            quantidade: Number(ing?.quantidade || 0),
            unidade: String(ing?.unidade || '').toUpperCase(),
        })),
        modo_preparo: modoRaw.map((step: any) => ({
            id: crypto.randomUUID(),
            text: typeof step === 'string' ? step : String(step?.text || ''),
        })),
        observacoes: String(parsed.observacoes || ''),
        stripedRows: true,
        exibir_modo_preparo: true,
        exibir_observacoes: true,
    };
    return sanitize(recipe);
};

// ─── Component ────────────────────────────────────────────────
export const ImportModal: React.FC<ImportModalProps> = ({
    type, isOpen, onClose, onSuccess, onError, sanitizeRecipe,
}) => {
    const { t } = useI18n();
    const { advancedMode } = useAdvancedMode();

    const [codeText, setCodeText] = useState('');
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);
    const [templateOpen, setTemplateOpen] = useState(true);
    const fileRef = useRef<HTMLInputElement>(null);

    const template = type === 'json' ? JSON_TEMPLATE : XML_TEMPLATE;
    const lang = type;
    const isJson = type === 'json';

    const handleClose = () => {
        setCodeText('');
        setError('');
        onClose();
    };

    const processFile = useCallback(async (file: File) => {
        setError('');
        try {
            const text = await file.text();
            if (isJson) {
                onSuccess(parseJsonText(text, sanitizeRecipe));
            } else {
                const recipe = await parseXMLString(text);
                onSuccess(sanitizeRecipe(recipe));
            }
            handleClose();
        } catch {
            setError(t('import.parseError'));
        }
    }, [isJson, sanitizeRecipe, onSuccess, t]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleCodeImport = async () => {
        if (!codeText.trim()) { setError(t('import.emptyError')); return; }
        setError('');
        try {
            if (isJson) {
                onSuccess(parseJsonText(codeText, sanitizeRecipe));
            } else {
                const recipe = await parseXMLString(codeText);
                onSuccess(sanitizeRecipe(recipe));
            }
            handleClose();
        } catch {
            setError(t('import.parseError'));
        }
    };

    if (!isOpen) return null;

    const title = isJson ? t('buttons.importJson') : t('buttons.importXml');
    const accept = isJson ? '.json,application/json' : '.xml,application/xml,text/xml';

    return (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            <div
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface-0)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2.5">
                        {isJson
                            ? <FileJson size={18} style={{ color: 'var(--primary)' }} />
                            : <FileCode2 size={18} style={{ color: 'var(--primary)' }} />
                        }
                        <h2 className="text-base font-bold" style={{ color: 'var(--ink-0)' }}>{title}</h2>
                    </div>
                    <button onClick={handleClose} className="ds-icon-button">
                        <X size={14} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* Drop zone / file picker */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-8 px-4 text-center"
                        style={{
                            borderColor: dragging ? 'var(--primary)' : 'var(--border)',
                            background: dragging ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'var(--surface-1)',
                        }}
                    >
                        <Upload size={24} style={{ color: dragging ? 'var(--primary)' : 'var(--ink-2)' }} />
                        <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--ink-0)' }}>
                                {t('import.dropOrClick')}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                                {isJson ? t('import.jsonAccept') : t('import.xmlAccept')}
                            </p>
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept={accept}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Template reference (collapsible) */}
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                        <button
                            onClick={() => setTemplateOpen(p => !p)}
                            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-[var(--surface-2)]"
                            style={{ color: 'var(--ink-2)', background: 'var(--surface-1)' }}
                        >
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <span onClick={() => setTemplateOpen(p => !p)}>{t('import.templateTitle')}</span>
                                <HintButton hint={t('hints.template')} />
                            </div>
                            {templateOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {templateOpen && (
                            <div className="max-h-64 overflow-auto">
                                <CodeBlock code={template} lang={lang} className="rounded-none m-0" />
                            </div>
                        )}
                    </div>

                    {/* Advanced: editable code area */}
                    {advancedMode && (
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>
                                {t('import.pasteCode')}
                            </label>
                            <textarea
                                className="w-full h-52 rounded-xl p-4 font-mono text-xs resize-none outline-none"
                                style={{
                                    background: '#0f172a',
                                    color: '#e2e8f0',
                                    border: '1px solid #334155',
                                    lineHeight: 1.6,
                                }}
                                spellCheck={false}
                                value={codeText}
                                onChange={e => { setCodeText(e.target.value); setError(''); }}
                                placeholder={template}
                            />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs" style={{ color: 'var(--ink-2)' }}>
                        {advancedMode ? t('import.advancedHint') : t('import.basicHint')}
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={handleClose} className="ds-button text-sm">
                            {t('common.cancel')}
                        </button>
                        {advancedMode && (
                            <button
                                onClick={handleCodeImport}
                                disabled={!codeText.trim()}
                                className="ds-button-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {t('import.confirm')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
