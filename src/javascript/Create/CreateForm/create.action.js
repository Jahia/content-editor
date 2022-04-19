import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';
import React, {useContext, useState} from 'react';
import {ComponentRendererContext} from '@jahia/ui-extender';
import * as PropTypes from 'prop-types';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useKeydownListener} from '~/utils/getKeydownListener';

const Create = ({render: Render, loading: Loading, ...otherProps}) => {
    const componentRenderer = useContext(ComponentRendererContext);
    const formik = useFormikContext();
    const {mode} = useContentEditorContext();
    const [clicked, setClicked] = useState(false);

    useKeydownListener((event, formik) => {
        if (event.ctrlKey && event.keyCode === Constants.keyCodes.s && mode === Constants.routes.baseCreateRoute) {
            save(formik);
        }
    });

    const save = async formik => {
        const formIsValid = await validateForm(formik, componentRenderer);

        if (formIsValid) {
            setClicked(true);
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
        <Render {...otherProps}
                addWarningBadge={Object.keys(formik.errors).length > 0}
                enabled={mode === Constants.routes.baseCreateRoute}
                disabled={clicked && !formik.dirty}
                onClick={() => save(formik)}/>
    );
};

Create.propTypes = {
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const createButtonAction = {
    component: Create
};

export default createButtonAction;

