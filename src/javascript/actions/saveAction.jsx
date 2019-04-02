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
        if (context.formik) {
            let {setFieldValue, submitForm} = context.formik;
            if (context.submitOperation) {
                setFieldValue(EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION, context.submitOperation, false);
            }

            submitForm();
        }
    }
});
