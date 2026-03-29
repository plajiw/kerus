import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Sliders } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme'; 

interface UserProfileMenuProps {
    collapsed: boolean;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ collapsed }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { themeMode } = useTheme();
    const isDark = themeMode !== 'light' && themeMode !== 'sepia';

    const user = {
        name: 'Pablo Ribeiro Ramos',
        email: 'pabloribeiro.cont@gmail.com',
        initials: 'PR',
        company: 'Kerus',
        isAdmin: true
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [collapsed]);

    return (
        <div className="relative mt-auto w-full" ref={menuRef}>
            {/* --- Gatilho do Menu --- */}
            {/* --- Gatilho do Menu --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center px-3 py-2 rounded-xl transition-all duration-200 outline-none
                    ${isOpen ? 'bg-[var(--surface-2)]' : 'hover:bg-[var(--surface-2)]'}
                `}
                title={collapsed ? user.name : undefined}
            >
                {/* 1. Container âncora de 20px (w-5) */}
                <div className="flex items-center justify-center flex-shrink-0 w-5">
                    {/* 2. Avatar com 'flex-shrink-0' e 'min-w-[32px]' adicionados para blindar o quadrado! */}
                    <div
                        className="w-8 h-8 min-w-[32px] flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-black select-none transition-transform active:scale-95"
                        style={{
                            background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)`,
                            color: '#FFFFFF'
                        }}
                    >
                        {user.initials}
                    </div>
                </div>

                {/* Info Text (Efeito sanfona fluido) */}
                <div 
                    className={`flex flex-col items-start min-w-0 overflow-hidden transition-all duration-200 whitespace-nowrap
                        ${collapsed ? 'w-0 opacity-0 ml-0' : 'flex-1 opacity-100 ml-3'}
                    `}
                >
                    <span className="text-sm font-bold truncate w-full text-left leading-tight" style={{ color: 'var(--ink-0)' }}>
                        {user.name}
                    </span>
                    <span className="text-[10px] font-semibold truncate w-full text-left mt-0.5" style={{ color: 'var(--ink-2)' }}>
                        {user.company}
                    </span>
                </div>
            </button>

            {/* --- Popover Flutuante --- */}
            {isOpen && (
                <div
                    className={`absolute z-[300] bottom-[calc(100%+8px)] mb-1 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                        collapsed ? 'left-0 w-[240px]' : 'left-0 right-0'
                    }`}
                    style={{
                        background: 'var(--surface-2)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        outline: `4px solid var(--surface-0)`
                    }}
                >
                    {/* Cabeçalho (Identificação) */}
                    <div className="px-4 py-3" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
                        <p className="text-sm font-bold truncate" style={{ color: 'var(--ink-0)' }}>{user.name}</p>
                        <p className="text-[11px] font-medium truncate mt-0.5" style={{ color: 'var(--ink-2)' }}>{user.email}</p>
                        {user.isAdmin && (
                            <div className="mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest" style={{ background: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)' }}>
                                ADMIN
                            </div>
                        )}
                    </div>

                    <div className="p-1.5 flex flex-col gap-0.5">
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-[var(--surface-3)]" style={{ color: 'var(--ink-1)' }}>
                            <User size={14} className="opacity-70" />
                            Meu Perfil
                        </button>
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-[var(--surface-3)]" style={{ color: 'var(--ink-1)' }}>
                            <Sliders size={14} className="opacity-70" />
                            Minhas Preferências
                        </button>

                        <div className="h-px w-full my-1" style={{ background: 'var(--border)' }} />

                        <button 
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-[var(--status-error-bg)] group" 
                            style={{ color: 'var(--ink-1)' }}
                        >
                            <LogOut size={14} className="opacity-70 group-hover:opacity-100 group-hover:text-[var(--status-error-text)] transition-colors" />
                            <span className="group-hover:text-[var(--status-error-text)] transition-colors">
                                Sair do Kerus
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};