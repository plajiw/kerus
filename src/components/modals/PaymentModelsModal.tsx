import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentModel } from '../../types';
import { PaymentConfigPanel, PaymentData } from '../common/PaymentConfigPanel';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const PaymentModelsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { paymentModels, savePaymentModel, deletePaymentModel } = useApp();
    const [editingId, setEditingId] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [modelData, setModelData] = useState<PaymentData>({
        entryPercentage: 50,
        installments: 1,
        paymentTerms: '',
        method: undefined,
        interestRate: 0,
        penaltyFee: 0,
    });

    if (!isOpen) return null;

    const handleEdit = (model: PaymentModel) => {
        setEditingId(model.id);
        setName(model.name);
        setModelData({
            entryPercentage: model.entryPercentage,
            installments: model.installments,
            paymentTerms: model.paymentTerms,
            method: model.method,
            interestRate: model.interestRate,
            penaltyFee: model.penaltyFee,
        });
    };

    const handleCreateNew = () => {
        setEditingId('new');
        setName('');
        setModelData({
            entryPercentage: 50,
            installments: 1,
            paymentTerms: '',
        });
    };

    const handleSave = () => {
        if (!name.trim()) return;
        savePaymentModel({
            id: editingId === 'new' ? crypto.randomUUID() : (editingId as string),
            name,
            ...modelData
        });
        setEditingId(null);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja remover este modelo?')) {
            deletePaymentModel(id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div 
                className="w-full max-w-5xl rounded-2xl flex flex-col"
                style={{ background: 'var(--surface-0)', maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                        <CreditCard size={20} style={{ color: 'var(--primary)' }} />
                        <h2 className="font-bold text-xl leading-none mt-0.5" style={{ color: 'var(--ink-0)' }}>
                            Modelos de Pagamento
                        </h2>
                    </div>
                    <button onClick={onClose} className="ds-icon-button"><X size={20} /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-5 sm:p-6" style={{ background: 'var(--surface-1)' }}>
                    <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                        {/* List */}
                        <div className="w-full md:w-[320px] shrink-0 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--ink-2)]">Modelos Salvos</h3>
                                <button onClick={handleCreateNew} className="text-xs font-bold flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: 'var(--primary)' }}>
                                    <Plus size={12} /> Novo
                                </button>
                            </div>
                            {paymentModels.length === 0 ? (
                                <p className="text-xs text-[var(--ink-2)] italic p-4 bg-[var(--surface-1)] rounded-xl border border-[var(--border)] text-center">
                                    Nenhum modelo cadastrado.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {paymentModels.map(m => (
                                        <div
                                            key={m.id}
                                            onClick={() => handleEdit(m)}
                                            className="flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer"
                                            style={{ 
                                                background: editingId === m.id ? 'var(--surface-2)' : 'var(--surface-1)', 
                                                borderColor: editingId === m.id ? 'var(--primary)' : 'var(--border)'
                                            }}
                                        >
                                            <div>
                                                <div className="font-bold text-sm text-[var(--ink-0)]">{m.name}</div>
                                                <div className="text-xs text-[var(--ink-2)] mt-0.5">
                                                    Entrada: {m.entryPercentage}% · Parcelas: {m.installments}x
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDelete(m.id, e)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-[var(--ink-2)] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Editor */}
                        <div className="flex-1 bg-[var(--surface-0)] rounded-2xl p-6 sm:p-8 h-min">
                            {editingId ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-2">
                                        <Edit2 size={20} className="text-[var(--ink-2)]" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--ink-0)] mt-0.5">
                                            {editingId === 'new' ? 'Criar Novo Modelo' : 'Editar Modelo'}
                                        </h3>
                                    </div>
                                    
                                    <PaymentConfigPanel 
                                        value={modelData}
                                        onChange={setModelData}
                                        showNameField={true}
                                        nameValue={name}
                                        onNameChange={setName}
                                    />

                                    <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                                        <button onClick={() => setEditingId(null)} className="ds-button flex-1 justify-center py-3 text-sm">Cancelar</button>
                                        <button 
                                            onClick={handleSave} 
                                            disabled={!name.trim()}
                                            className="ds-button-primary flex-1 justify-center py-3 text-sm disabled:opacity-50"
                                        >
                                            Salvar Modelo
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-40">
                                    <Edit2 size={48} strokeWidth={1.5} className="mb-4 text-[var(--ink-2)]" />
                                    <p className="text-lg font-bold text-[var(--ink-0)] mb-1">Selecione um modelo</p>
                                    <p className="text-sm text-[var(--ink-2)] max-w-[250px]">Ou clique em Novo para começar a configurar um padrão de pagamento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


