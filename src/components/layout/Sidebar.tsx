import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FlaskConical, LayoutDashboard, FileText, Receipt,
    Package, Settings, ChevronLeft, ChevronRight, Moon, Sun
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

export const Sidebar: React.FC = () => {
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

    const NavItem = ({ item }: { item: NavItem }) => {
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
                `}
                style={isActive ? { backgroundColor: primaryColor } : undefined}
            >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                    <>
                        <span className="text-sm font-semibold flex-1 truncate">{item.label}</span>
                        {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-2)] uppercase tracking-wider">
                                {item.badge}
                            </span>
                        )}
                    </>
                )}
                {collapsed && item.badge && (
                    <span className="absolute left-8 top-0 w-2 h-2 rounded-full bg-[var(--ink-2)]" />
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
        <aside
            className={`
                flex flex-col h-full border-r transition-all duration-200 flex-shrink-0
                ${collapsed ? 'w-[60px]' : 'w-[220px]'}
            `}
            style={{
                backgroundColor: 'var(--surface-0)',
                borderColor: 'var(--border)',
            }}
        >
            {/* Logo */}
            <div
                className={`flex items-center gap-2.5 h-14 px-3 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}
                style={{ borderBottom: '1px solid var(--border)' }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                >
                    <FlaskConical size={15} />
                </div>
                {!collapsed && (
                    <span className="font-black text-[var(--ink-0)] text-sm uppercase tracking-tight leading-tight">
                        Kerus
                    </span>
                )}
            </div>

            {/* Main nav */}
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {!collapsed && (
                    <p className="text-[10px] font-bold text-[var(--ink-2)] uppercase tracking-widest px-3 pt-3 pb-1.5">
                        {t('nav.modules')}
                    </p>
                )}
                {mainNav.map(item => <NavItem key={item.to} item={item} />)}
            </nav>

            {/* Bottom actions */}
            <div className="p-2 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
                {bottomNav.map(item => <NavItem key={item.to} item={item} />)}

                {/* Dark mode toggle */}
                <button
                    onClick={toggleDark}
                    title={isDark ? t('nav.lightMode') : t('nav.darkMode')}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                        text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-0)]
                        ${collapsed ? 'justify-center' : ''}
                    `}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    {!collapsed && <span className="text-sm font-semibold">{isDark ? t('nav.lightMode') : t('nav.darkMode')}</span>}
                </button>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(p => !p)}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                        text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-1)]
                        ${collapsed ? 'justify-center' : ''}
                    `}
                >
                    {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs font-semibold">{t('nav.collapse')}</span></>}
                </button>
            </div>
        </aside>
    );
};
