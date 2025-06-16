import React from 'react';
import {FormikErrors} from "formik";

interface Props {
    errorText?: string | FormikErrors<any> | string[] | FormikErrors<any>[];
    error?: boolean;
    type?: string;
    placeholder?: string;
    handleChange: (e)=>void;
    name: string;
}

const ThemeInput:React.FC<Props> = ({error, errorText,name,handleChange, type= 'text', placeholder}) => {
    return (
        <>
            <input
                type={type}
                name={name}
                className='bg-white border rounded-md w-full px-3 py-3  focus:outline-primary'
                onChange={handleChange}
                placeholder={placeholder}
            />
            {
                error ?
                    <div className='text-red-400 text-xs'>{errorText}</div>
                    : null
            }
        </>
    )
}

export default ThemeInput;
