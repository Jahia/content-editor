import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {Constants} from '~/ContentEditor.constants';

export default composeActions(withFormikAction, {
    init: () => {
        // TODO BACKLOG-11052
    },
    onClick: ({formik}) => {
        if (!formik) {
            return;
        }

        const {submitForm, setFieldValue, resetForm} = formik;

        setFieldValue(
            Constants.editPanel.OPERATION_FIELD,
            Constants.editPanel.submitOperation.CREATE,
            false
        );

        submitForm()
            .then(() => resetForm(formik.values));
    }
});
