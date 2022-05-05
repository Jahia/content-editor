import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext, useState} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {useKeydownListener} from '~/utils/getKeydownListener';
import {adaptCreateFormData} from '~/Create/Create.adapter';
import {useTranslation} from 'react-i18next';

const Create = ({createAnother, render: Render, loading: Loading, ...otherProps}) => {
    const {t} = useTranslation('content-editor');
    const componentRenderer = useContext(ComponentRendererContext);
    const formik = useFormikContext();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {envProps, lang} = contentEditorConfigContext;
    const {mode, setErrors, refetchFormData} = useContentEditorContext();
    const [clicked, setClicked] = useState(false);

    useKeydownListener((event, formik) => {
        if (mode !== Constants.routes.baseCreateRoute) {
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.keyCode === Constants.keyCodes.s) {
            event.preventDefault();
            save(formik);
        }
    });

    const save = async formik => {
        const errors = await validateForm(formik, componentRenderer);

        if (errors) {
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
                        refetchFormData().then(res => {
                            const formData = adaptCreateFormData(res.data, lang, t, contentEditorConfigContext);
                            formik.resetForm({values: formData.initialValues});
                            setClicked(false);
                        });
                    } else {
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
                enabled={mode === Constants.routes.baseCreateRoute}
                disabled={clicked}
                onClick={() => save(formik)}/>
    );
};

Create.propTypes = {
    render: PropTypes.func.isRequired,
    loading: PropTypes.func,
    createAnother: PropTypes.bool
};

const createButtonAction = {
    component: Create
};

export default createButtonAction;

