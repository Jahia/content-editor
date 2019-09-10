import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import EditPanelConstants from '~/EditPanelContainer/EditPanel/EditPanelConstants';
import {Constants} from '~/ContentEditor.constants';

export default composeActions(withFormikAction, {
    init: context => {
        // BACKLOG-11052
        context.enabled = context.nodeData.hasPermission &&
            !context.formik.dirty &&
            context.nodeData.aggregatedPublicationInfo.publicationStatus === EditPanelConstants.publicationStatus.PUBLISHED;
    },
    onClick: ({formik}) => {
        if (!formik) {
            return;
        }

        const {submitForm, setFieldValue, resetForm} = formik;

        setFieldValue(
            Constants.editPanel.OPERATION_FIELD,
            Constants.editPanel.submitOperation.UNPUBLISH,
            false
        );

        submitForm()
            .then(() => resetForm(formik.values));
    }
});
