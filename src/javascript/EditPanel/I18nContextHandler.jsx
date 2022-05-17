import {useEffect, useRef} from 'react';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';

export const I18nContextHandler = () => {
    const formik = useFormikContext();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, i18nContext} = useContentEditorContext();
    const formikRef = useRef();

    useEffect(() => {
        formikRef.current = formik;

        if (contentEditorConfigContext.envProps.dirtyRef && formik) {
            contentEditorConfigContext.envProps.dirtyRef.current = formik.dirty || Object.keys(i18nContext).some(k => k !== lang && k !== 'shared' && i18nContext[k] && Object.keys(i18nContext[k]).length > 0);
        }
    }, [formik, contentEditorConfigContext.envProps.dirtyRef, i18nContext, lang]);

    useEffect(() => {
        if (i18nContext.shared || i18nContext[lang]) {
            formikRef.current.setValues({
                ...formikRef.current.values,
                ...i18nContext.shared?.values,
                ...i18nContext[lang]?.values
            }, i18nContext[lang]);
        }
    }, [contentEditorConfigContext.envProps, i18nContext, lang]);

    return false;
};
