import {useEffect, useRef} from 'react';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
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
    const {i18nContext} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();

    const dirty = formik.dirty || Object.keys(i18nContext).length > 0;

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
