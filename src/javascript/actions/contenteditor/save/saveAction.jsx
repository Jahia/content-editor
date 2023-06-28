import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/validation';
import React, {useContext} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {
    useContentEditorConfigContext,
    useContentEditorContext,
    useContentEditorSectionContext,
    usePublicationInfoContext
} from '~/contexts';
import {useFormikContext} from 'formik';
import {isDirty, useKeydownListener} from '~/utils';

const Save = ({render: Render, loading: Loading, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const {publicationInfoPolling} = usePublicationInfoContext();
    const {mode, i18nContext, siteInfo, lang, resetI18nContext, setErrors} = useContentEditorContext();
    const {onSavedCallback} = useContentEditorConfigContext();
    const {sections} = useContentEditorSectionContext();
    const formik = useFormikContext();

    useKeydownListener(event => {
        if (mode !== Constants.routes.baseEditRoute) {
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.keyCode === Constants.keyCodes.s) {
            event.preventDefault();
            save(formik);
        }
    });

    const dirty = isDirty(formik, i18nContext);

    const save = async formik => {
        const {errors, i18nErrors} = await validateForm(formik, i18nContext, sections, lang, siteInfo, componentRenderer);

        if (errors || i18nErrors) {
            setErrors({...errors});
            return;
        }

        if (dirty) {
            return formik
                .submitForm()
                .then(data => {
                    if (data) {
                        resetI18nContext();
                        formik.resetForm({values: formik.values});
                        onSavedCallback(data);
                    }
                });
        }
    };

    if (Loading) {
        return <Loading {...otherProps}/>;
    }

    return (
        <Render
            {...otherProps}
            addWarningBadge={Object.keys(formik.errors).length > 0}
            isVisible={mode === Constants.routes.baseEditRoute}
            disabled={!dirty || publicationInfoPolling}
            onClick={() => save(formik)}
        />
    );
};

Save.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

export const saveAction = {
    component: Save
};

