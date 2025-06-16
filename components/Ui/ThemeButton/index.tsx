import classNames from 'classnames';
import React from 'react';

interface Props {
    block?: boolean;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    rounded?: boolean;
    size?: 'xs' | 'sm' | 'xl';
    gradient?: boolean;
    onClick?: ()=>void;
    disabled?: boolean;
    medium?: boolean;
    outline?: boolean;
    color?: 'primary' | 'white' | 'gradient' | 'default',
    className?: string;
}

const Index:React.FC<Props> = ({
    children,
    size,
    gradient,
    rounded,
    block,
    type ,
    loading,
    onClick,
    disabled,
    medium,
    outline,
    color,
    className

}) => {
    return (
        <>
            <button className={classNames('py-2 px-4 rounded-md hover:opacity-90 transition active:scale-99  disabled:opacity-25', className, {
                'w-full': block,
                'rounded-3xl': rounded,
                'px-1 text-xs': size === 'xs',
                'px-3 py-2 text-sm': size === 'sm',
                'px-4 py-2 text-lg': size === 'xl',
                'bg-primary border-primary text-white': !gradient && !outline,
                'font-medium': medium,
                'bg-gradient-to-r from-primary to-accent border-none': gradient,
                'bg-transparent border border-primary': outline,
                'text-white border-white': color === 'white',
                'text-black': color === 'gradient',
                'text-primary border-primary': color === 'primary'
            })}
                    type={type}
                    onClick={onClick}
                    disabled={disabled}
            >
                {
                   loading ?
                       <span className='flex justify-center'>
                            {children}
                             <svg className="animate-spin -ml-1 ml-3 h-5 w-5 text-white " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                       </span>
                        :
                        children
                }
            </button>
        </>
    );
};

export default Index;
