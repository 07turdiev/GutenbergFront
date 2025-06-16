import {useEffect, useState} from "react";

const UseLocalStorage = (key:string, initialValue:string = '') => {

    const [value, setValue] = useState(() => {
        if (typeof window !== 'undefined'){
            return localStorage.getItem(key) || initialValue
        }
    });

    useEffect(() => {
        localStorage.setItem(key, String(value))
    }, [value])

    return [value, setValue] as const
}

export default UseLocalStorage;