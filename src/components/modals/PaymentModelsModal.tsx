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
                className="w-full max-w-2xl rounded-2xl shadow-xl flex flex-col"
                style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                        <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                        <h2 className="font-bold text-lg leading-none mt-0.5" style={{ color: 'var(--ink-0)' }}>
                            Modelos de Pagamento
                        </h2>
                    </div>
                    <button onClick={onClose} className="ds-icon-button"><X size={18} /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-5 bg-gray-50/50 dark:bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* List */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--ink-2)]">Modelos Salvos</h3>
                                <button onClick={handleCreateNew} className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1">
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
                                            className="flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer hover:shadow-sm"
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
                                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-[var(--ink-2)] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Editor */}
                        <div className="bg-[var(--surface-0)] rounded-xl border border-[var(--border)] p-4 shadow-sm h-min">
                            {editingId ? (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--ink-2)] border-b border-[var(--border)] pb-2 mb-3">
                                        {editingId === 'new' ? 'Criar Novo Modelo' : 'Editar Modelo'}
                                    </h3>
                                    
                                    <PaymentConfigPanel 
                                        value={modelData}
                                        onChange={setModelData}
                                        showNameField={true}
                                        nameValue={name}
                                        onNameChange={setName}
                                    />

                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => setEditingId(null)} className="ds-button flex-1 justify-center">Cancelar</button>
                                        <button 
                                            onClick={handleSave} 
                                            disabled={!name.trim()}
                                            className="ds-button-primary flex-1 justify-center disabled:opacity-50"
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center opacity-50">
                                    <Edit2 size={32} className="mb-3 text-[var(--ink-2)]" />
                                    <p className="text-sm font-semibold text-[var(--ink-1)]">Selecione um modelo</p>
                                    <p className="text-xs text-[var(--ink-2)]">Ou crie um novo para começar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


