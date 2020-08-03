import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext, useState} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';

const Create = ({context, render: Render, loading: Loading}) => {
    const componentRenderer = useContext(ComponentRendererContext);

    const [clicked, setClicked] = useState(false);
    if (Loading) {
        return <Loading context={context}/>;
    }

    return (
        <Render
            context={{
                ...context,
                addWarningBadge: Object.keys(context.formik.errors).length > 0,
                enabled: context.mode === Constants.routes.baseCreateRoute,
                disabled: clicked && !context.formik.dirty,
                onClick: async ({formik}) => {
                    const formIsValid = await validateForm(formik, componentRenderer);

                    if (formIsValid) {
                        setClicked(true);
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

