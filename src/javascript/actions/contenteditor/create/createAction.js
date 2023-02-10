import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/validation';
import React, {useContext, useState} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {useKeydownListener} from '~/utils';

const Create = ({createAnother, render: Render, loading: Loading, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const formik = useFormikContext();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {envProps} = contentEditorConfigContext;
    const {mode, resetI18nContext, setErrors, siteInfo, lang, refetchFormData, initialValues, i18nContext} = useContentEditorContext();
    const [clicked, setClicked] = useState(false);
    const {sections} = useContentEditorSectionContext();

    useKeydownListener(event => {
        if (mode !== Constants.routes.baseCreateRoute) {
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.keyCode === Constants.keyCodes.s) {
            event.preventDefault();
            save(formik);
        }
    });

    const save = async formik => {
        const {errors, i18nErrors} = await validateForm(formik, i18nContext, sections, lang, siteInfo, componentRenderer);

        if (errors || i18nErrors) {
            setErrors({...errors});
            return;
        }

        setClicked(true);
        return formik
            .submitForm()
            .then(data => {
                if (data) {
                    if (createAnother) {
                        // Refetch only to generate a new valid system name
                        refetchFormData().then(() => {
                            resetI18nContext();
                            formik.resetForm({values: initialValues});
                            setClicked(false);
                            if (envProps.onCreateAnother) {
                                envProps.onCreateAnother();
                            }
                        });
                    } else {
                        resetI18nContext();
                        formik.resetForm({values: formik.values});
                        if (envProps.onSavedCallback) {
                            envProps.onSavedCallback(data);
                        }
                    }
                } else {
                    setClicked(false);
                }
            });
    };

    if (Loading) {
        return <Loading {...otherProps}/>;
    }

    return (
        <Render {...otherProps}
                addWarningBadge={Object.keys(formik.errors).length > 0}
                isVisible={mode === Constants.routes.baseCreateRoute}
                disabled={clicked}
                onClick={() => save(formik)}/>
    );
};

Create.propTypes = {
    render: PropTypes.func.isRequired,
    loading: PropTypes.func,
    createAnother: PropTypes.bool
};

export const createAction = {
    component: Create
};
