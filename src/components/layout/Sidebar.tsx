import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FlaskConical, LayoutDashboard, Receipt, Package, Wrench,
    ChevronLeft, ChevronRight, BookOpen, Building, Users, Settings
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { usePreferences } from '../../hooks/usePreferences';
import { AppVersion } from '../ui/AppVersion';
import { UserProfileMenu } from './UserProfileMenu';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

interface NavItem {
    to: string;
    icon: React.ReactNode;
    label: string;
    badge?: string;
    disabled?: boolean;
    isNavLink?: boolean;
    onClick?: () => void;
}

// ─── Single nav row fluído ─────────────────────────────────────
const NavRow: React.FC<{
    item: NavItem;
    collapsed: boolean;
    active?: boolean;
}> = ({ item, collapsed, active }) => {
    const inner = (
        <div
            className={`
                flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative
                ${active
                    ? 'text-white'
                    : item.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : 'text-[var(--ink-1)] hover:text-[var(--ink-0)] hover:bg-[var(--surface-2)]'
                }
            `}
            style={active ? { backgroundColor: 'var(--primary)' } : undefined}
            title={collapsed ? item.label : undefined}
        >
            {/* Ícone com tamanho fixo para ancorar a linha na esquerda */}
            <div className="flex items-center justify-center flex-shrink-0 w-5">
                {item.icon}
            </div>

            {/* Container do texto e badge que encolhe suavemente */}
            <div 
                className={`flex items-center justify-between overflow-hidden transition-all duration-200 whitespace-nowrap
                    ${collapsed ? 'w-0 opacity-0 ml-0' : 'w-full opacity-100 ml-3'}
                `}
            >
                <span className="text-sm font-semibold truncate">{item.label}</span>
                {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--ink-2)] uppercase tracking-wider ml-2">
                        {item.badge}
                    </span>
                )}
            </div>
        </div>
    );

    if (item.disabled) return <div>{inner}</div>;
    if (item.onClick) return <button className="w-full text-left outline-none" onClick={item.onClick}>{inner}</button>;
    if (item.to.startsWith('http') || item.to.startsWith('/docs')) return <a href={item.to} className="outline-none">{inner}</a>;
    
    return <NavLink to={item.to} end={item.to === '/'} className="outline-none">{inner}</NavLink>;
};

// ─── Nav group fluído ──────────────────────────────────────────
const NavGroup: React.FC<{
    label: string;
    items: NavItem[];
    collapsed: boolean;
    location: string;
}> = ({ label, items, collapsed, location }) => {
    const isActive = (item: NavItem) => {
        if (!item.to || item.onClick) return false;
        if (item.to === '/') return location === '/';
        return location.startsWith(item.to);
    };

    return (
        <div className="flex flex-col gap-0.5">
            <span 
                className={`px-3 text-[10px] font-black text-[var(--ink-2)] uppercase tracking-widest whitespace-nowrap overflow-hidden transition-all duration-200 
                    ${collapsed ? 'h-0 opacity-0 py-0' : 'h-auto opacity-100 py-1'}
                `}
            >
                {label}
            </span>
            {items.map((item) => (
                <NavRow key={item.to ?? item.label} item={item} collapsed={collapsed} active={isActive(item)} />
            ))}
        </div>
    );
};

// ─── Sidebar Principal ─────────────────────────────────────────
export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
    const { t } = useI18n();
    const { prefs, updatePrefs } = usePreferences();
    const location = useLocation();

    // Mock de Auth: No futuro, pegue isso do seu AuthContext
    const user = { isAdmin: true };

    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
    );
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const collapsed = prefs.sidebarCollapsed && isDesktop;

    const modulesItems: NavItem[] = [
        { to: '/', icon: <LayoutDashboard size={18} />, label: t('nav.dashboard') },
        { to: '/fichas-tecnicas', icon: <FlaskConical size={18} />, label: t('nav.sheets') },
        { to: '/orcamentos', icon: <Receipt size={18} />, label: t('nav.quotations') },
        { to: '/servicos', icon: <Wrench size={18} />, label: t('nav.services') },
        { to: '/estoque', icon: <Package size={18} />, label: t('nav.stock'), disabled: true },
    ];

    const adminItems: NavItem[] = [
        { to: '/admin/empresa', icon: <Building size={18} />, label: 'Empresa' },
        { to: '/admin/equipe', icon: <Users size={18} />, label: 'Equipe' },
        { to: '/configuracoes', icon: <Settings size={18} />, label: 'Configurações' },
    ];

    return (
        <>
            {isOpen && <div className="fixed inset-0 z-[200] bg-black/50 lg:hidden" onClick={onClose} />}

            <aside
                className={`
                    flex flex-col flex-shrink-0
                    fixed top-0 h-screen z-[210] transition-all duration-200
                    lg:relative lg:h-full lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    w-[260px] ${collapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'}
                `}
                style={{ backgroundColor: 'var(--surface-0)' }}
            >
                {/* Logo */}
                <div className={`flex items-center h-16 px-5 flex-shrink-0 transition-all duration-200 ${collapsed ? 'lg:justify-center px-0' : ''}`}>
                    {collapsed ? (
                        <span className="hidden lg:flex items-center justify-center font-black text-2xl uppercase" style={{ color: 'var(--primary)' }}>K</span>
                    ) : (
                        <div className="flex flex-col leading-none overflow-hidden whitespace-nowrap">
                            <span className="font-black text-2xl uppercase tracking-[0.05em]" style={{ color: 'var(--primary)' }}>Kerus</span>
                            <AppVersion className="opacity-50 mt-1" />
                        </div>
                    )}
                </div>

                {/* Nav modules */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-6">
                    <NavGroup
                        label={t('nav.modules')}
                        items={modulesItems}
                        collapsed={collapsed}
                        location={location.pathname}
                    />

                    {/* Renderiza o bloco de Administração apenas se for Admin */}
                    {user.isAdmin && (
                        <NavGroup
                            label="Administração"
                            items={adminItems}
                            collapsed={collapsed}
                            location={location.pathname}
                        />
                    )}
                </nav>

                {/* Bottom Section: Collapse + User + Docs fluídos */}
                <div className="px-3 pb-4 pt-2 flex flex-col gap-1 mt-auto">
                    
                    {/* Collapse toggle */}
                    <button
                        onClick={() => updatePrefs({ sidebarCollapsed: !collapsed })}
                        className="hidden lg:flex w-full items-center px-3 py-2.5 rounded-lg transition-all duration-200 outline-none text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-1)]"
                        title={collapsed ? "Expandir menu" : "Recolher menu"}
                    >
                        {/* Ícone ancorado */}
                        <div className="flex items-center justify-center flex-shrink-0 w-5">
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </div>
                        
                        {/* Texto fluído */}
                        <div className={`overflow-hidden transition-all duration-200 whitespace-nowrap text-left ${collapsed ? 'w-0 opacity-0 ml-0' : 'w-full opacity-100 ml-3'}`}>
                            <span className="text-xs font-bold uppercase tracking-wider">{t('nav.collapse')}</span>
                        </div>
                    </button>

                    <div className="w-full h-px my-1" style={{ background: 'var(--border)' }} />

                    {/* Perfil de Usuário */}
                    <UserProfileMenu collapsed={collapsed} />

                    {/* Documentação */}
                    <a 
                        href="/docs/" 
                        className="flex items-center px-3 py-2.5 mt-1 rounded-lg transition-all duration-200 outline-none text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-0)]"
                        title={collapsed ? 'Documentação' : undefined}
                    >
                        {/* Ícone ancorado */}
                        <div className="flex items-center justify-center flex-shrink-0 w-5">
                            <BookOpen size={16} className="opacity-80" />
                        </div>

                        {/* Texto fluído */}
                        <div className={`overflow-hidden transition-all duration-200 whitespace-nowrap text-left ${collapsed ? 'w-0 opacity-0 ml-0' : 'w-full opacity-100 ml-3'}`}>
                            <span className="text-xs font-semibold">Documentação</span>
                        </div>
                    </a>
                </div>
            </aside>
        </>
    );
};