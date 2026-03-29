import React from 'react';
import { Wrench } from 'lucide-react';
import { HubHeader } from '../../components/ui/hub/HubHeader';

export const ServicesPage: React.FC = () => {
    return (
        <div className="p-6 lg:p-8 animate-in fade-in duration-300">
            <HubHeader
                title="Serviços"
                subtitle="Catálogo de serviços para orçamentos"
            />

            <div
                className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed"
                style={{ borderColor: 'var(--border)' }}
            >
                <Wrench size={40} className="mb-4 opacity-20" style={{ color: 'var(--ink-1)' }} />
                <p className="font-semibold mb-1" style={{ color: 'var(--ink-1)' }}>
                    Módulo em desenvolvimento
                </p>
                <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
                    O catálogo de serviços estará disponível em breve.
                </p>
            </div>
        </div>
    );
};
