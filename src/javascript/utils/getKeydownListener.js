import {useEffect} from 'react';
import {useContentEditorConfigContext} from '~/ContentEditor.context';

export const useKeydownListener = handler => {
    const contentEditorConfigContext = useContentEditorConfigContext();

    useEffect(() => {
        const fcn = event => {
            handler(event, contentEditorConfigContext.envProps.formikRef.current);
        };

        addEventListener('keydown', fcn);
        return () => {
            removeEventListener('keydown', fcn);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
