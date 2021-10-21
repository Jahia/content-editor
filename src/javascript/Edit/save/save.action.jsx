import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';

const Save = ({values, errors, dirty, mode, onSaved, render: Render, loading: Loading, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const {publicationInfoPolling} = usePublicationInfoContext();

    if (Loading) {
        return <Loading {...otherProps}/>;
    }

    return (
        <Render
            {...otherProps}
            addWarningBadge={Object.keys(errors).length > 0}
            enabled={mode === Constants.routes.baseEditRoute}
            disabled={!dirty || publicationInfoPolling}
            onClick={async ({formik}) => {
                const formIsValid = await validateForm(formik, componentRenderer);
                if (formIsValid) {
                    return formik
                        .submitForm()
                        .then(() => {
                            formik.resetForm({values});
                            if (onSaved) {
                                onSaved();
                            }
                        });
                }
            }}
        />
    );
};

Save.propTypes = {
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    dirty: PropTypes.bool.isRequired,
    context: PropTypes.object.isRequired,
    onSaved: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const saveButtonAction = {
    component: Save
};

export default saveButtonAction;

