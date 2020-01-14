import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    withFormikAction,
    {
        init: context => {
            if (context.isMainButton) {
                context.enabled = context.enabled &&
                    !context.nodeData.hasPublishPermission &&
                    context.nodeData.hasStartPublicationWorkflowPermission;
                context.disabled = context.nodeData.lockedAndCannotBeEdited || context.formik.dirty;
            } else {
                context.enabled = context.enabled && context.nodeData.hasPublishPermission;

                // In case the action is in the menu, formik is in parent context
                if (context.enabled && (context.nodeData.lockedAndCannotBeEdited || context.parent.formik.dirty)) {
                    context.enabled = false;
                    context.displayDisabled = true;
                }
            }
        },
        onClick: context => {
            window.parent.authoringApi.openPublicationWorkflow(
                [context.nodeData.uuid],
                false, // Not publishing all subNodes (AKA sub pages)
                false, // Not publishing all language
                false // Not unpublish action
            );
        }
    }
);
