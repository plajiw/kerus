import React, { forwardRef } from 'react';

export type IconButtonVariant = 'primary' | 'ghost' | 'danger' | 'surface' | 'transparent';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    isActive?: boolean;
    title: string;
    /** Evita que o clique no botão dispare eventos no componente pai (ex: Cards) */
    stopProp?: boolean;
    customColor?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    icon, variant = 'ghost', size = 'md', isActive = false, title, 
    className = '', style, disabled, stopProp = true, customColor, onClick, ...props
}, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (stopProp) e.stopPropagation();
        if (onClick) onClick(e);
    };

    // Definição de tamanhos padrão seguindo o Design System v3.0
    const sizeSpecs = {
        xs: { dims: '24px', icon: 12, radius: 'var(--radius-sm)' },
        sm: { dims: '32px', icon: 14, radius: 'var(--radius-sm)' },
        md: { dims: '36px', icon: 16, radius: 'var(--radius-md)' },
        lg: { dims: '40px', icon: 18, radius: 'var(--radius-md)' },
    };

    const currentSize = sizeSpecs[size];

    // Lógica de variantes centralizada (Refatoração: Evolução do Cérebro Visual)
    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case 'primary': 
                return { background: 'var(--primary)', color: '#FFFFFF' };
            case 'danger': 
                return { background: 'var(--status-error-bg)', color: 'var(--status-error-text)' };
            case 'surface': 
                return { background: 'var(--surface-3)', color: 'var(--ink-1)' };
            case 'transparent':
                return { background: 'transparent', color: isActive ? 'var(--primary)' : 'var(--ink-2)' };
            default: // ghost
                return { background: 'transparent', color: isActive ? 'var(--primary)' : 'var(--ink-1)' };
        }
    };

    return (
        <button
            ref={ref}
            type="button"
            title={title}
            aria-label={title}
            disabled={disabled}
            onClick={handleClick}
            className={[
                variant === 'transparent' ? '' : 'ds-icon-button',
                // surface já tem bg via inline — usa brightness para feedback de hover
                variant === 'surface' ? 'hover:brightness-90 active:brightness-75' : '',
                'transition-all duration-200 active:scale-90',
                className,
            ].filter(Boolean).join(' ')}
            style={{
                width: currentSize.dims,
                height: currentSize.dims,
                borderRadius: currentSize.radius,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: 'none',
                ...getVariantStyles(),
                // customColor sobrescreve a cor da variante quando fornecida
                ...(customColor ? { color: customColor } : {}),
                ...style
            }}
            {...props}
        >
            {/* UX: "Click Area Correction" - O cloneElement injeta o size correto no ícone Lucide automaticamente */}
            {React.isValidElement(icon) 
                ? React.cloneElement(icon as React.ReactElement<any>, { size: currentSize.icon }) 
                : icon}
        </button>
    );
});

IconButton.displayName = 'IconButton';