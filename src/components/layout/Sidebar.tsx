import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FlaskConical, LayoutDashboard, Receipt,
    Package, Settings, ChevronLeft, ChevronRight, Moon, Sun, X,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n.tsx';
import { useTheme } from '../../hooks/useTheme';

interface NavItem {
    to: string;
    icon: React.ReactNode;
    label: string;
    badge?: string;
    disabled?: boolean;
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
    const { t } = useI18n();
    const { isDark, toggleDark, primaryColor } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const mainNav: NavItem[] = [
        { to: '/', icon: <LayoutDashboard size={18} />, label: t('nav.dashboard') },
        { to: '/formulas', icon: <FlaskConical size={18} />, label: t('nav.formulas') },
        { to: '/orcamentos', icon: <Receipt size={18} />, label: t('nav.quotations') },
        { to: '/estoque', icon: <Package size={18} />, label: t('nav.stock'), badge: t('nav.soon'), disabled: true },
    ];

    const bottomNav: NavItem[] = [
        { to: '/configuracoes', icon: <Settings size={18} />, label: t('nav.settings') },
    ];

    const NavItemComponent = ({ item }: { item: NavItem }) => {
        const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);

        const content = (
            <div
                className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                    ${isActive
                        ? 'text-white'
                        : item.disabled
                            ? 'opacity-40 cursor-not-allowed'
                            : 'text-[var(--ink-1)] hover:text-[var(--ink-0)] hover:bg-[var(--surface-2)]'
                    }
                    ${collapsed ? 'lg:justify-center' : ''}
                `}
                style={isActive ? { backgroundColor: primaryColor } : undefined}
            >
                <span className="flex-shrink-0">{item.icon}</span>
                {/* Labels: always visible on mobile drawer, hide on desktop when collapsed */}
                <span className={`text-sm font-semibold flex-1 truncate ${collapsed ? 'lg:hidden' : ''}`}>
                    {item.label}
                </span>
                {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-2)] uppercase tracking-wider ${collapsed ? 'lg:hidden' : ''}`}>
                        {item.badge}
                    </span>
                )}
                {/* Dot indicator for badge when collapsed on desktop */}
                {collapsed && item.badge && (
                    <span className="hidden lg:block absolute left-8 top-0 w-2 h-2 rounded-full bg-[var(--ink-2)]" />
                )}
            </div>
        );

        if (item.disabled) {
            return <div title={item.label}>{content}</div>;
        }

        return (
            <NavLink to={item.to} title={collapsed ? item.label : undefined} end={item.to === '/'}>
                {content}
            </NavLink>
        );
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[200] bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    flex flex-col border-r flex-shrink-0
                    fixed top-0 h-screen z-[210] transition-transform duration-200
                    lg:relative lg:h-full lg:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    w-[260px] ${collapsed ? 'lg:w-[60px]' : 'lg:w-[220px]'}
                `}
                style={{
                    backgroundColor: 'var(--surface-0)',
                    borderColor: 'var(--border)',
                }}
            >
                {/* Logo */}
                <div
                    className={`flex items-center gap-2.5 h-14 px-3 flex-shrink-0 ${collapsed ? 'lg:justify-center' : ''}`}
                    style={{ borderBottom: '1px solid var(--border)' }}
                >
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <FlaskConical size={15} />
                    </div>
                    <span className={`font-black text-[var(--ink-0)] text-sm uppercase tracking-tight leading-tight ${collapsed ? 'lg:hidden' : ''}`}>
                        Kerus
                    </span>
                    {/* Close button — mobile only */}
                    <button
                        onClick={onClose}
                        className="lg:hidden ml-auto ds-icon-button flex-shrink-0"
                        aria-label="Fechar menu"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Main nav */}
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    <p className={`text-[10px] font-bold text-[var(--ink-2)] uppercase tracking-widest px-3 pt-3 pb-1.5 ${collapsed ? 'lg:hidden' : ''}`}>
                        {t('nav.modules')}
                    </p>
                    {mainNav.map(item => <NavItemComponent key={item.to} item={item} />)}
                </nav>

                {/* Bottom actions */}
                <div className="p-2 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
                    {bottomNav.map(item => <NavItemComponent key={item.to} item={item} />)}

                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleDark}
                        title={isDark ? t('nav.lightMode') : t('nav.darkMode')}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                            text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-0)]
                            ${collapsed ? 'lg:justify-center' : ''}
                        `}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        <span className={`text-sm font-semibold ${collapsed ? 'lg:hidden' : ''}`}>
                            {isDark ? t('nav.lightMode') : t('nav.darkMode')}
                        </span>
                    </button>

                    {/* Collapse toggle — desktop only */}
                    <button
                        onClick={() => setCollapsed(p => !p)}
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
