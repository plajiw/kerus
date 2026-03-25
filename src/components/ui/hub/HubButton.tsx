import React from 'react';

// Enforces the Design System rule: Icon OR Text — never both.
// variant='primary' | 'secondary'  → text-only button
// variant='icon'                   → icon-only button (requires title for accessibility)

type HubTextButtonProps = {
    variant: 'primary' | 'secondary';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
};

type HubIconButtonProps = {
    variant: 'icon';
    icon: React.ReactNode;
    title: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
};

export type HubButtonProps = HubTextButtonProps | HubIconButtonProps;

export const HubButton: React.FC<HubButtonProps> = (props) => {
    if (props.variant === 'icon') {
        return (
            <button
                className={`ds-icon-button ${props.className ?? ''}`}
                title={props.title}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.icon}
            </button>
        );
    }

    return (
        <button
            className={`${props.variant === 'primary' ? 'ds-button-primary' : 'ds-button'} ${props.className ?? ''}`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.label}
        </button>
    );
};
