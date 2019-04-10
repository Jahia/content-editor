import {composeActions} from '@jahia/react-material';
import EditPanelConstants from '../EditPanelContainer/EditPanel/EditPanelConstants';
import {withFormikAction} from './withFormikAction';

export default composeActions(withFormikAction, {
    init: context => {
        // It's weird, formik set dirty when intialValue === currentValue
        // event when form had been modified
        context.enabled = context.formik.dirty;
    },
    onClick: context => {
        if (!context.formik) {
            return;
        }

        const {submitForm, resetForm, setFieldValue} = context.formik;

        context.submitOperation = EditPanelConstants.submitOperation.SAVE;
        setFieldValue(EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION, context.submitOperation, false);

        return submitForm()
            .then(() => {
                return resetForm(context.formik.values);
            });
    }
});
