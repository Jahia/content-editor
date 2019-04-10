import {composeActions} from '@jahia/react-material';
import {withFormikAction} from './withFormikAction';
import EditPanelConstants from '../EditPanelContainer/EditPanel/EditPanelConstants';

export default composeActions(withFormikAction, {
    init: context => {
        // It's weird, formik set dirty when intialValue === currentValue
        // event when form had been modified
        context.enabled = !context.formik.dirty;
    },
    onClick: context => {
        if (!context.formik) {
            return;
        }

        const {submitForm, setFieldValue} = context.formik;

        context.submitOperation = EditPanelConstants.submitOperation.SAVE_PUBLISH;
        setFieldValue(EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION, context.submitOperation, false);

        submitForm();
    }
});
