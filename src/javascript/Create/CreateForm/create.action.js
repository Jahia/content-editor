import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext, useState} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';

const Create = props => {
    const {mode, values, errors, dirty, render: Render, loading: Loading} = props;
    const componentRenderer = useContext(ComponentRendererContext);

    const [clicked, setClicked] = useState(false);
    if (Loading) {
        return <Loading {...props}/>;
    }

    return (
        <Render {...props}
                addWarningBadge={Object.keys(errors).length > 0}
                enabled={mode === Constants.routes.baseCreateRoute}
                disabled={clicked && !dirty}
                onClick={async ({formik}) => {
                    const formIsValid = await validateForm(formik, componentRenderer);

                    if (formIsValid) {
                        setClicked(true);
                        return formik
                            .submitForm()
                            .then(() => {
                                formik.resetForm(values);
                            });
                    }
                }}/>
    );
};

Create.propTypes = {
    mode: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const createButtonAction = {
    component: Create
};

export default createButtonAction;

