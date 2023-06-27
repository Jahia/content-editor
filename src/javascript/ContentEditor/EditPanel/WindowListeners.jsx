import {useEffect, useRef} from 'react';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import {useFormikContext} from 'formik';
import {isDirty} from '~/utils';

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
    const contentEditorConfigContext = useContentEditorConfigContext();

    const dirty = isDirty(formik, i18nContext);

    useEffect(() => {
        if (!registered.current && dirty) {
            registered.current = true;
            registerListeners(contentEditorConfigContext);
        }

        return () => {
            if (registered.current) {
                registered.current = false;
                unregisterListeners(contentEditorConfigContext);
            }
        };
    }, [registered, contentEditorConfigContext, dirty]);

    return false;
};
