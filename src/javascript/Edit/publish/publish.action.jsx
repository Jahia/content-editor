import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '../../actions/withFormik.action';
import EditPanelConstants from '../../EditPanelContainer/EditPanel/EditPanelConstants';

export default composeActions(withFormikAction, {
    init: context => {
        // It's weird, formik set dirty when intialValue === currentValue
        // event when form had been modified
        context.enabled = context.nodeData.hasPermission &&
            !context.formik.dirty &&
            ![
                EditPanelConstants.publicationStatus.PUBLISHED,
                EditPanelConstants.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
            ].includes(context.nodeData.aggregatedPublicationInfo.publicationStatus);
    },
    onClick: context => {
        if (!context.formik) {
            return;
        }

        const {submitForm, setFieldValue, resetForm} = context.formik;

        context.submitOperation = EditPanelConstants.submitOperation.SAVE_PUBLISH;
        setFieldValue(EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION, context.submitOperation, false);

        submitForm().then(() => {
            return resetForm(context.formik.values);
        });
    }
});
