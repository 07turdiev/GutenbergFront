import React from 'react';

interface Props {
    onClick: () => void;
    disabled: boolean;
}

const NextTrack:React.FC<Props> = ({onClick, disabled}) => {
    return (
        <button className='md:mr-6 mr-2 transition hover:text-primary disabled:text-gray-200' onClick={onClick} disabled={disabled}>
            <svg width="14" height="15" viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.84333 13.205L8.575 8.45667C9.22833 7.99 9.22833 7.01 8.575 6.555L1.84333 1.795C1.06167 1.25833 0 1.80667 0 2.75167V12.2483C0 13.1933 1.06167 13.7417 1.84333 13.205ZM11.6667 1.66667V13.3333C11.6667 13.975 12.1917 14.5 12.8333 14.5C13.475 14.5 14 13.975 14 13.3333V1.66667C14 1.025 13.475 0.5 12.8333 0.5C12.1917 0.5 11.6667 1.025 11.6667 1.66667Z"/>
            </svg>
        </button>

    );
};

export default NextTrack;
