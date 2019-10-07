import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '../../actions/withFormik.action';
import {Constants} from '~/ContentEditor.constants';
import {reduxAction} from '~/actions/redux.action';

const stateMapToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(withFormikAction,
    reduxAction(stateMapToContext), {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseEditRoute && context.nodeData.hasPermission;

            if (context.enabled) {
                context.disabled = context.formik.dirty || [
                    Constants.editPanel.publicationStatus.PUBLISHED,
                    Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
                ].includes(context.nodeData.aggregatedPublicationInfo.publicationStatus);
            }
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
