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
    const previousDirty = useRef();
    const formik = useFormikContext();
    const {envProps} = useContentEditorConfigContext();
    const dirty = formik.dirty;

    useEffect(() => {
        if (!previousDirty.current && dirty) {
            registerListeners(envProps);
        }

        previousDirty.current = dirty;
        return () => unregisterListeners(envProps);
    }, [previousDirty, envProps, dirty]);

    return false;
};
