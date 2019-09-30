import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {Constants} from '~/ContentEditor.constants';
import {reduxAction} from '~/actions/redux.action';

const stateMapToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    withFormikAction,
    reduxAction(stateMapToContext),
    {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseCreateRoute;
        },
        onClick: ({formik}) => {
            if (!formik) {
                return;
            }

            const {submitForm, setFieldValue, resetForm, validateForm, setTouched, values} = formik;

            setFieldValue(
                Constants.editPanel.OPERATION_FIELD,
                Constants.editPanel.submitOperation.CREATE,
                false
            );

            submitForm()
                .then(() => {
                    // Store errors for restore error state
                    const errors = formik.errors;
                    resetForm(values);
                    validateForm(values);
                    const touched = {};
                    Object.keys(errors).forEach(key => {
                        touched[key] = true;
                    });
                    setTouched(touched);
                });
        }
    }
);
