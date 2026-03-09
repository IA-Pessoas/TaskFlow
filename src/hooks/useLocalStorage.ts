import {useState} from 'react';
import type{ Dispatch, SetStateAction} from 'react';

function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>]{
    const [storedValue, setStoredValue] = useState<T>(() => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    });

    const setValue : Dispatch<SetStateAction<T>> = (value) =>{
        const valueToStore = value instanceof Function ? value (storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore)); 
    };

    return [storedValue, setValue];
}

export{useLocalStorage}