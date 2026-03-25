import React, { useState } from 'react';
import { PaymentMethod } from '../../types';
import { 
    ChevronDown, 
    ChevronUp, 
    Zap, 
    CreditCard, 
    FileText, 
    Landmark, 
    Banknote, 
    Wand2 
} from 'lucide-react';

export interface PaymentData {
    method?: PaymentMethod;
    entryPercentage: number;
    installments: number;
    interestRate?: number;
    penaltyFee?: number;
    paymentTerms: string;
}

interface Props {
    value: PaymentData;
    onChange: (data: PaymentData) => void;
    showNameField?: boolean;
    nameValue?: string;
    onNameChange?: (name: string) => void;
}

const METHODS: { id: PaymentMethod; label: string; Icon: React.ElementType }[] = [
    { id: 'pix', label: 'Pix', Icon: Zap },
    { id: 'credit', label: 'Crédito', Icon: CreditCard },
    { id: 'boleto', label: 'Boleto', Icon: FileText },
    { id: 'transfer', label: 'Transf.', Icon: Landmark },
    { id: 'cash', label: 'Dinheiro', Icon: Banknote },
];

const parseNumber = (v: string) => {
    const parsed = parseFloat(v.replace(',', '.'));
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

export const PaymentConfigPanel: React.FC<Props> = ({
    value, onChange, showNameField, nameValue, onNameChange
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const update = (patch: Partial<PaymentData>) => {
        onChange({ ...value, ...patch });
    };

    const handleMagicTerms = () => {
        const lines: string[] = [];
        const methodObj = METHODS.find(m => m.id === value.method);
        const methodLabel = methodObj?.label || 'A Combinar';
        
        if (value.entryPercentage > 0 && value.entryPercentage < 100) {
            lines.push(`Sinal de ${value.entryPercentage}% para início dos testes laboratoriais ou viabilidade do projeto, saldo de ${100 - value.entryPercentage}% na entrega final ou conclusão da OS.`);
        } else if (value.entryPercentage === 100) {
            lines.push(`Pagamento integral à vista via ${methodLabel} antes do início dos serviços.`);
        } else {
            lines.push(`Pagamento via ${methodLabel} dividido em ${value.installments}x sem entrada.`);
        }

        if (value.installments > 1 && value.entryPercentage < 100) {
            lines.push(`O saldo poderá ser parcelado em até ${value.installments}x via ${methodLabel}.`);
        }

        if (value.penaltyFee || value.interestRate) {
            const encargos = [];
            if (value.penaltyFee) encargos.push(`multa fixa de ${value.penaltyFee}%`);
            if (value.interestRate) encargos.push(`juros de mora de ${value.interestRate}% ao mês`);
            lines.push(`Em caso de atraso injustificado, incidirá ${encargos.join(' e ')} sobre o montante devido.`);
        }

        update({ paymentTerms: lines.join(' ') });
    };

    return (
        <div className="space-y-6">
            {showNameField && (
                <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
                    <label className="block text-sm font-bold text-[var(--ink-0)] mb-1">Nome do Modelo</label>
                    <p className="text-xs text-[var(--ink-2)] mb-3">Dê um nome para identificar este padrão rapidamente (Ex: "Padrão Cosmético 50/50").</p>
                    <input
                        className="ds-input w-full ds-input-lg"
                        placeholder="Ex: OS Padrão - 2x Sem Juros"
                        value={nameValue || ''}
                        onChange={e => onNameChange?.(e.target.value)}
                    />
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--ink-2)]">Forma de Pagamento Base</h3>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {METHODS.map(m => {
                        const Icon = m.Icon;
                        const isSelected = value.method === m.id;
                        return (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => update({ method: m.id })}
                                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all"
                                style={{
                                    background: isSelected ? 'var(--primary)' : 'var(--surface-0)',
                                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                                    color: isSelected ? '#FFFFFF' : 'var(--ink-1)',
                                    boxShadow: isSelected ? '0 4px 12px rgba(99,102,241,0.2)' : 'none',
                                }}
                            >
                                <Icon size={26} strokeWidth={isSelected ? 2.5 : 1.5} />
                                <span className="text-sm font-bold">{m.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
                <div>
                    <label className="block text-sm font-bold text-[var(--ink-0)] mb-1">Pagamento Inicial (Sinal)</label>
                    <p className="text-[11px] text-[var(--ink-2)] mb-3">Porcentagem cobrada no aceite da OS.</p>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="ds-input ds-input-lg w-full pr-14 text-right font-bold text-lg"
                            value={value.entryPercentage || ''}
                            onChange={e => update({ entryPercentage: parseNumber(e.target.value) })}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[var(--ink-2)]">%</div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-[var(--ink-0)] mb-1">Parcelas do Saldo</label>
                    <p className="text-[11px] text-[var(--ink-2)] mb-3">Em quantas vezes o restante será dividido.</p>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            max="36"
                            className="ds-input ds-input-lg w-full pr-14 text-right font-bold text-lg"
                            value={value.installments || ''}
                            onChange={e => update({ installments: parseInt(e.target.value) || 1 })}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[var(--ink-2)]">vzs</div>
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--border)] pt-5 text-center">
                <button 
                    type="button"
                    className="flex items-center justify-center gap-2 mx-auto text-sm font-bold uppercase tracking-wider transition-colors py-2 px-5 rounded-xl hover:bg-[var(--surface-2)]"
                    style={{ color: showAdvanced ? 'var(--primary)' : 'var(--ink-2)' }}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Configurações de Atraso e Termos
                </button>
            </div>

            {showAdvanced && (
                <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-xl border" style={{ borderColor: 'rgba(234,88,12,0.3)', background: 'rgba(234,88,12,0.05)' }}>
                        <div>
                            <label className="block text-sm font-bold text-[var(--ink-0)] mb-1">Juros ao Mês</label>
                            <p className="text-[11px] text-[var(--ink-2)] mb-3">Acréscimo % por atraso no pagamento.</p>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    className="ds-input ds-input-lg w-full pr-14 text-right font-bold"
                                    value={value.interestRate || ''}
                                    onChange={e => update({ interestRate: parseNumber(e.target.value) })}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[var(--ink-2)]">%</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--ink-0)] mb-1">Multa Fixa</label>
                            <p className="text-[11px] text-[var(--ink-2)] mb-3">Penalidade única % em caso de atraso.</p>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    className="ds-input ds-input-lg w-full pr-14 text-right font-bold"
                                    value={value.penaltyFee || ''}
                                    onChange={e => update({ penaltyFee: parseNumber(e.target.value) })}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[var(--ink-2)]">%</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                            <div>
                                <label className="block text-sm font-bold text-[var(--ink-0)] mb-0.5">Termos Contratuais de Pagamento</label>
                                <p className="text-[11px] text-[var(--ink-2)]">Este texto sairá nas condições do PDF do seu orçamento.</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleMagicTerms}
                                className="ds-button-primary flex items-center gap-1.5 text-xs py-2 px-3 h-auto"
                            >
                                <Wand2 size={14} /> Auto-Gerar Termo
                            </button>
                        </div>
                        <textarea
                            className="ds-textarea w-full text-base leading-relaxed p-4"
                            rows={4}
                            placeholder="Descreva as condições contratuais, marcos de pagamento e regras para o cliente."
                            value={value.paymentTerms}
                            onChange={e => update({ paymentTerms: e.target.value })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
