import {useEffect, useRef} from 'react';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import {useFormikContext} from 'formik';
import {isDirty} from '~/utils';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const handleBeforeUnloadEvent = ev => {
    ev.preventDefault();
    ev.returnValue = '';
};

export const WindowListeners = () => {
    const registered = useRef(false);
    const unblock = useRef();
    const formik = useFormikContext();
    const {i18nContext} = useContentEditorContext();
    const history = useHistory();
    const dirty = isDirty(formik, i18nContext);
    const {closed} = useContentEditorConfigContext();
    const {t} = useTranslation('content-editor');

    useEffect(() => {
        if (!registered.current && dirty && !closed) {
            registered.current = true;
            // Prevent close browser's tab when there is unsaved content
            window.addEventListener('beforeunload', handleBeforeUnloadEvent);
            unblock.current = history.block((location, action) => {
                if (action === 'POP') {
                    return t('content-editor:label.contentEditor.edit.action.goBack.alert');
                }
            });
        }

        return () => {
            if (registered.current) {
                registered.current = false;
                window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
                unblock.current();
                unblock.current = null;
            }
        };
    }, [registered, dirty, history, t, closed]);

    return false;
};
