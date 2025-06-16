import React from 'react';
import classNames from "classnames";

interface Props {
    onClick?: ()=>void;
    className?: string;
    disabled?: boolean;
}

const PlayButton:React.FC<Props> = ({onClick, className, disabled}) => {
    return (
        <button className={classNames('w-5 transition hover:text-primary', className)} onClick={onClick} disabled={disabled}>
            <svg width="21" height="21" viewBox="0 0 18 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.333008 1.86676V19.1334C0.333008 20.4501 1.78301 21.2501 2.89967 20.5334L16.4663 11.9001C17.4997 11.2501 17.4997 9.75009 16.4663 9.08343L2.89967 0.466761C1.78301 -0.249905 0.333008 0.550095 0.333008 1.86676Z"/>
            </svg>
        </button>
    );
};

export default PlayButton;
