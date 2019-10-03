import {composeActions} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {reduxAction} from '~/actions/redux.action';

const mapStateToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    reduxAction(mapStateToContext),
    {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseEditRoute &&
                context.nodeData.hasPermission &&
                context.nodeData.aggregatedPublicationInfo.publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED;
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
