import {useEffect} from 'react';

export const useKeydownListener = handler => {
    useEffect(() => {
        addEventListener('keydown', handler);
        return () => {
            removeEventListener('keydown', handler);
        };
    }, [handler]);
};
