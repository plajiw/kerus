import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { PaymentConfigPanel, PaymentData } from '../common/PaymentConfigPanel';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    value: PaymentData;
    onSave: (data: PaymentData) => void;
}

export const QuotationPaymentModal: React.FC<Props> = ({ isOpen, onClose, value, onSave }) => {
    const [data, setData] = useState<PaymentData>(value);

    // Sync when opened
    useEffect(() => { 
        if (isOpen) setData(value); 
    }, [isOpen, value]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div 
                className="w-full max-w-2xl rounded-2xl shadow-xl flex flex-col"
                style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', maxHeight: '90vh' }}
            >
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} style={{ color: 'var(--primary)' }} />
                        <h2 className="font-bold text-lg leading-none mt-0.5" style={{ color: 'var(--ink-0)' }}>
                            Configurar Pagamento
                        </h2>
                    </div>
                    <button onClick={onClose} className="ds-icon-button"><X size={18} /></button>
                </div>
                
                <div className="flex-1 overflow-auto p-5">
                    <PaymentConfigPanel value={data} onChange={setData} />
                </div>

                <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                    <button onClick={onClose} className="ds-button">Cancelar</button>
                    <button 
                        onClick={() => { onSave(data); onClose(); }} 
                        className="ds-button-primary"
                    >
                        Confirmar Condições
                    </button>
                </div>
            </div>
        </div>
    );
};
