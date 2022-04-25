import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useKeydownListener} from '~/utils/getKeydownListener';

const Save = ({render: Render, loading: Loading, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const {publicationInfoPolling} = usePublicationInfoContext();
    const {mode} = useContentEditorContext();
    const formik = useFormikContext();

    useKeydownListener((event, formik) => {
        if (event.ctrlKey && event.keyCode === Constants.keyCodes.s && mode === Constants.routes.baseEditRoute) {
            event.preventDefault();
            save(formik);
        }
    });

    const save = async formik => {
        const formIsValid = await validateForm(formik, componentRenderer);
        if (formIsValid && formik.dirty) {
            return formik
                .submitForm()
                .then(() => {
                    formik.resetForm({values: formik.values});
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
            enabled={mode === Constants.routes.baseEditRoute}
            disabled={!formik.dirty || publicationInfoPolling}
            onClick={() => save(formik)}
        />
    );
};

Save.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const saveButtonAction = {
    component: Save
};

export default saveButtonAction;

