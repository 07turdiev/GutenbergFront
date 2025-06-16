import React from 'react';
import classNames from "classnames";

interface Props {
    onClick: () => void;
    disabled: boolean;
    active: boolean;
}

const AddToBookmark:React.FC<Props> = ({onClick, active, disabled}) => {
    return (
        <button className={classNames('md:ml-6 ml-4 transition hover:text-primary ', {
            'text-primary': active,
            'fill-primary': active
        })}
            onClick={onClick}
            disabled={disabled}
        >

            <svg width="18" height="21" viewBox="0 0 18 21"  xmlns="http://www.w3.org/2000/svg">
                <path d="M14.833 0H3.16634C1.88301 0 0.833008 1.05 0.833008 2.33333V21L8.99968 17.5L17.1663 21V2.33333C17.1663 1.05 16.1163 0 14.833 0ZM14.833 17.5L8.99968 14.9567L3.16634 17.5V3.5C3.16634 2.85833 3.69134 2.33333 4.33301 2.33333H13.6663C14.308 2.33333 14.833 2.85833 14.833 3.5V17.5Z"/>
            </svg>
        </button>
    );
};

export default AddToBookmark;
