import {useEffect, useRef} from 'react';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';

const handleBeforeUnloadEvent = ev => {
    ev.preventDefault();
    ev.returnValue = '';
};

const registerListeners = envProps => {
    // Prevent close browser's tab when there is unsaved content
    window.addEventListener('beforeunload', handleBeforeUnloadEvent);
    if (envProps.registerListeners) {
        envProps.registerListeners();
    }
};

const unregisterListeners = envProps => {
    window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
    if (envProps.unregisterListeners) {
        envProps.unregisterListeners();
    }
};

export const WindowListeners = () => {
    const registered = useRef(false);
    const formik = useFormikContext();
    const {envProps} = useContentEditorConfigContext();
    // Todo "formik.dirty || envProps.dirtyRef.current" is not very clear but required to get rerendered on formik state change
    const dirty = formik.dirty || envProps.dirtyRef.current;

    useEffect(() => {
        if (!registered.current && dirty) {
            registered.current = true;
            registerListeners(envProps);
        }

        return () => {
            if (registered.current) {
                registered.current = false;
                unregisterListeners(envProps);
            }
        };
    }, [registered, envProps, dirty]);

    return false;
};
