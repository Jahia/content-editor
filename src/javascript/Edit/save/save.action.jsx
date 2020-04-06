import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';

const Save = ({context, render: Render, loading: Loading}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const {publicationInfoPolling} = usePublicationInfoContext();

    if (Loading) {
        return <Loading context={context}/>;
    }

    return (
        <Render
            context={{
                ...context,
                addWarningBadge: Object.keys(context.formik.errors).length > 0,
                enabled: context.mode === Constants.routes.baseEditRoute,
                disabled: !context.formik.dirty || publicationInfoPolling,
                onClick: async ({formik}) => {
                    const formIsValid = await validateForm(formik, componentRenderer);

                    if (formIsValid) {
                        return formik
                            .submitForm()
                            .then(() => {
                                formik.resetForm(formik.values);
                            });
                    }
                }
            }}/>
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

