import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';

const Create = ({context, render: Render, loading: Loading}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    if (Loading) {
        return <Loading context={context}/>;
    }

    return (
        <Render
            context={{
                ...context,
                addWarningBadge: Object.keys(context.formik.errors).length > 0,
                enabled: context.mode === Constants.routes.baseCreateRoute,
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

Create.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const createButtonAction = {
    component: Create
};

export default createButtonAction;

