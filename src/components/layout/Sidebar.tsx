import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FlaskConical, LayoutDashboard, Receipt, Package,
    Settings, ChevronLeft, ChevronRight, Moon, Sun,
    X, BookOpen,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useTheme } from '../../hooks/useTheme';
import { usePreferences } from '../../hooks/usePreferences';
import { AppVersion } from '../ui/AppVersion';

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

// ─── Single nav row ────────────────────────────────────────────
const NavRow: React.FC<{
    item: NavItem;
    collapsed: boolean;
    active?: boolean;
}> = ({ item, collapsed, active }) => {
    const inner = (
        <div
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative
                ${active
                    ? 'text-white'
                    : item.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : 'text-[var(--ink-1)] hover:text-[var(--ink-0)] hover:bg-[var(--surface-2)]'
                }
                ${collapsed ? 'justify-center' : ''}
            `}
            style={active ? { backgroundColor: 'var(--primary)' } : undefined}
            title={collapsed ? item.label : undefined}
        >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
                <span className="text-sm font-semibold flex-1 truncate">{item.label}</span>
            )}
            {!collapsed && item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--ink-2)] uppercase tracking-wider">
                    {item.badge}
                </span>
            )}
        </div>
    );

    if (item.disabled) return <div>{inner}</div>;

    if (item.onClick) {
        return (
            <button className="w-full text-left" onClick={item.onClick}>
                {inner}
            </button>
        );
    }

    if (item.to.startsWith('http') || item.to.startsWith('/docs')) {
        return <a href={item.to}>{inner}</a>;
    }

    return (
        <NavLink to={item.to} end={item.to === '/'}>
            {inner}
        </NavLink>
    );
};

// ─── Nav group ─────────────────────────────────────────────────
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
            <span className={`px-3 py-1 text-[10px] font-black text-[var(--ink-2)] uppercase tracking-widest block overflow-hidden ${collapsed ? 'invisible' : ''}`}>
                {label}
            </span>
            {items.map((item) => (
                <NavRow key={item.to ?? item.label} item={item} collapsed={collapsed} active={isActive(item)} />
            ))}
        </div>
    );
};

// ─── Sidebar ───────────────────────────────────────────────────
export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
    const { t } = useI18n();
    const { isDark, toggleDark } = useTheme();
    const { prefs, updatePrefs } = usePreferences();
    const location = useLocation();

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
        { to: '/estoque', icon: <Package size={18} />, label: t('nav.stock'), disabled: true },
    ];

    const sistemaItems: NavItem[] = [
        { to: '/configuracoes', icon: <Settings size={18} />, label: t('nav.settings') },
        { to: '/docs/', icon: <BookOpen size={18} />, label: 'Documentação' },
        {
            to: '',
            icon: isDark ? <Sun size={18} /> : <Moon size={18} />,
            label: isDark ? t('nav.lightMode') : t('nav.darkMode'),
            onClick: toggleDark,
        },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[200] bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    flex flex-col flex-shrink-0
                    fixed top-0 h-screen z-[210] transition-all duration-200
                    lg:relative lg:h-full lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    w-[260px] ${collapsed ? 'lg:w-[60px]' : 'lg:w-[220px]'}
                `}
                style={{ backgroundColor: 'var(--surface-0)' }}
            >
                {/* Logo */}
                <div className={`flex items-center h-14 px-4 flex-shrink-0 ${collapsed ? 'lg:justify-center' : ''}`}>
                    {collapsed ? (
                        <span className="hidden lg:block font-black text-2xl uppercase" style={{ color: 'var(--primary)' }}>
                            K
                        </span>
                    ) : (
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-2xl uppercase tracking-[0.05em]" style={{ color: 'var(--primary)' }}>
                                Kerus
                            </span>
                            <AppVersion className="opacity-50 mt-1" />
                        </div>
                    )}
                </div>

                {/* Nav groups */}
                <nav className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-4">
                    <NavGroup
                        label={t('nav.modules')}
                        items={modulesItems}
                        collapsed={collapsed}
                        location={location.pathname}
                    />
                </nav>

                {/* Bottom: sistema + collapse */}
                <div className="px-2 pb-2 flex flex-col gap-1">
                    <NavGroup
                        label="Sistema"
                        items={sistemaItems}
                        collapsed={collapsed}
                        location={location.pathname}
                    />

                    {/* Collapse toggle — desktop only */}
                    <button
                        onClick={() => updatePrefs({ sidebarCollapsed: !collapsed })}
                        className={`
                            hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                            text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-1)]
                            ${collapsed ? 'justify-center' : ''}
                        `}
                    >
                        {collapsed
                            ? <ChevronRight size={16} />
                            : <><ChevronLeft size={16} /><span className="text-xs font-semibold">{t('nav.collapse')}</span></>
                        }
                    </button>
                </div>
            </aside>
        </>
    );
};
