import React from 'react';
import classNames from "classnames";

interface Props {
    active?: boolean;
    onClick: (cat: any) => void;
}

const Index:React.FC<Props> = ({children, active, onClick}) => {
    return (
        <button
            className={classNames('px-2 py-1 text-md mr-2 rounded-lg bg-gray-100 ', {
                'text-primary rounded-b-none pb-2 -mb-1': active
            })}
                onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Index;