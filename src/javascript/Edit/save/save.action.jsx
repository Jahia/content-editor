import {composeActions} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {withFormikAction} from '~/actions/withFormik.action';
import {reduxAction} from '~/actions/redux.action';

const mapStateToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    withFormikAction,
    reduxAction(mapStateToContext),
    {
        init: context => {
            // It's weird, formik set dirty when intialValue === currentValue
            // event when form had been modified
            context.enabled = context.mode === Constants.routes.baseEditRoute;

            const errors = context.formik.errors;
            context.disabled = !context.formik.dirty || Object.keys(errors).length > 0;
        },
        onClick: ({formik}) => {
            if (!formik) {
                return;
            }

            const {submitForm, resetForm, setFieldValue} = formik;

            setFieldValue(
                Constants.editPanel.OPERATION_FIELD,
                Constants.editPanel.submitOperation.SAVE,
                false
            );

            submitForm()
                .then(() => resetForm(formik.values));
        }
    });
