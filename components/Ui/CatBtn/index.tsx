import React from 'react';
import classNames from "classnames";

interface Props {
    size?: 'xs' | 'sm' | 'md';
    onClick?: () => void;
    className?: string;
}

const Index:React.FC<Props> = ({children, size, onClick, className}) => {
    return (
        <button onClick={onClick} className={classNames('px-3 py-1 rounded-md bg-red-50 text-primary truncate transition hover:bg-red-200', className, {
            'text-sm': size === 'sm',
            'text-xs': size === 'xs'
        })}>
            {children}
        </button>
    );
};

export default Index;
