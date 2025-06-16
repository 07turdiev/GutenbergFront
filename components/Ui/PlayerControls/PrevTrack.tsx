import React from 'react';

interface Props {
    onClick: () => void;
    disabled: boolean;
}

const PrevTrack:React.FC<Props> = ({onClick, disabled}) => {
    return (
        <button className='md:mr-5 mr-3 transition hover:text-primary disabled:text-gray-200' onClick={onClick} disabled={disabled}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.16667 0.5C1.80833 0.5 2.33333 1.025 2.33333 1.66667V13.3333C2.33333 13.975 1.80833 14.5 1.16667 14.5C0.525 14.5 0 13.975 0 13.3333V1.66667C0 1.025 0.525 0.5 1.16667 0.5ZM5.43667 8.45667L12.1683 13.205C12.9383 13.7533 14.0117 13.1933 14.0117 12.2483V2.75167C14.0117 1.80667 12.95 1.25833 12.1683 1.795L5.43667 6.54333C4.77167 7.01 4.77167 7.99 5.43667 8.45667Z" />
            </svg>
        </button>
    );
};

export default PrevTrack;
