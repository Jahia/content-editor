import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '../../actions/withFormik.action';
import {Constants} from '~/ContentEditor.constants';

export default composeActions(withFormikAction, {
    init: context => {
        // It's weird, formik set dirty when intialValue === currentValue
        // event when form had been modified
        context.enabled = context.nodeData.hasPermission &&
            !context.formik.dirty &&
            ![
                Constants.editPanel.publicationStatus.PUBLISHED,
                Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
            ].includes(context.nodeData.aggregatedPublicationInfo.publicationStatus);
    },
    onClick: ({formik}) => {
        if (!formik) {
            return;
        }

        const {submitForm, setFieldValue, resetForm} = formik;

        setFieldValue(
            Constants.editPanel.OPERATION_FIELD,
            Constants.editPanel.submitOperation.SAVE_PUBLISH,
            false
        );

        submitForm()
            .then(() => resetForm(formik.values));
    }
});
