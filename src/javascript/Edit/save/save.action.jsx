import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import {useContentEditorContext} from '~/ContentEditor.context';

const Save = ({values, errors, dirty, mode, render: Render, loading: Loading, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const {publicationInfoPolling} = usePublicationInfoContext();
    const {refetchFormData} = useContentEditorContext();

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
                            // TODO BACKLOG-13406 avoid refretch if possible
                            refetchFormData();
                            formik.resetForm(values);
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
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const saveButtonAction = {
    component: Save
};

export default saveButtonAction;

