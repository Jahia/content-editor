import {useEffect, useRef} from 'react';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';

export const I18nContextHandler = () => {
    const formik = useFormikContext();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, i18nContext, setI18nContext} = useContentEditorContext();
    const formikRef = useRef();

    useEffect(() => {
        formikRef.current = formik;
    }, [formik]);

    useEffect(() => {
        if (i18nContext.shared || i18nContext[lang]) {
            formikRef.current.setValues({
                ...formikRef.current.values,
                ...i18nContext.shared?.values,
                ...i18nContext[lang]?.values
            }, i18nContext[lang]);
        }
    }, [contentEditorConfigContext, i18nContext, lang]);

    useEffect(() => {
        setI18nContext(prev => ({
            ...prev,
            memo: {
                ...prev.memo,
                count: (prev.memo?.count || 0) + 1
            }
        }));
    }, [lang, setI18nContext]);

    return false;
};
