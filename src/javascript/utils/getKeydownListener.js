import {useEffect} from 'react';

export const useKeydownListener = (handler, dirty) => {
    useEffect(() => {
        addEventListener('keydown', handler);
        return () => {
            removeEventListener('keydown', handler);
        };
    }, [dirty]); // eslint-disable-line react-hooks/exhaustive-deps
};
