import React from 'react';
import InputMask from 'react-input-mask';
import classNames from "classnames";
import {FormikErrors} from "formik";

interface Props {
    errorText?: string | FormikErrors<any> | string[] | FormikErrors<any>[];
    error?: boolean;
    handleChange: (e)=>void;
    name: string;
}

const Index:React.FC<Props> = ({error, errorText, name, handleChange}) => {
    return (
        <div className='relative'>
            <InputMask
                placeholder="+998 (__) __-__-__"
                mask="+\9\98-99-999-99-99"
                name={name}
                onChange={handleChange}
                className={classNames('bg-white border rounded-md w-full px-3 py-3 focus:outline-primary text-gray-500 text-xl ', {
                    'border-red-400': error
                })}
            />
            {
                error ?
                    <div className='text-red-400 text-xs'>{errorText}</div>
                : null
            }
        </div>

    );
};

export default Index;
