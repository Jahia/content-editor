import {composeActions} from '@jahia/react-material';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    {
        init: context => {
            context.initStartWorkflow = true;
            if (context.isMainButton) {
                context.enabled = context.enabled &&
                    !context.nodeData.hasPublishPermission &&
                    context.nodeData.hasStartPublicationWorkflowPermission;
                context.disabled = context.nodeData.lockedAndCannotBeEdited || context.formik.dirty;
            } else {
                context.enabled = context.enabled && context.nodeData.hasPublishPermission;

                // In case the action is in the menu, formik is in parent context
                if (context.enabled && (context.nodeData.lockedAndCannotBeEdited || context.formik.dirty)) {
                    context.enabled = false;
                    context.displayDisabled = true;
                }
            }
        },
        onClick: context => {
            window.authoringApi.openPublicationWorkflow(
                [context.nodeData.uuid],
                false, // Not publishing all subNodes (AKA sub pages)
                false, // Not publishing all language
                false // Not unpublish action
            );
        }
    }
);
