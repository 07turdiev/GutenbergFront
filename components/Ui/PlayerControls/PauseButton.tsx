import React from 'react';
import classNames from "classnames";

interface Props {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

const PauseButton:React.FC<Props> = ({onClick, disabled, className}) => {
    return (
        <button className={classNames('w-6 h-6 transition hover:text-primary', className)} onClick={onClick} disabled={disabled}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    );
};

export default PauseButton;
