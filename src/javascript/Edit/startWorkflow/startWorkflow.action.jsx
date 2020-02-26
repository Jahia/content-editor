import {composeActions} from '@jahia/react-material';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    {
        init: context => {
            context.initStartWorkflow = true;
            if (context.isMainButton) {
                // Is Visible
                context.enabled = context.enabled &&
                    !context.nodeData.hasPublishPermission &&
                    context.nodeData.hasStartPublicationWorkflowPermission;

                // Is Active
                if (context.enabled && (context.nodeData.lockedAndCannotBeEdited || context.formik.dirty)) {
                    context.disabled = true;
                }
            } else {
                // Is Visible
                context.isVisible = context.enabled && context.nodeData.hasPublishPermission;

                // Is Active
                if (context.isVisible && (context.nodeData.lockedAndCannotBeEdited || context.formik.dirty)) {
                    context.enabled = false;
                }
            }
        },
        onClick: context => {
            if (context.enabled) {
                window.authoringApi.openPublicationWorkflow(
                    [context.nodeData.uuid],
                    false, // Not publishing all subNodes (AKA sub pages)
                    false, // Not publishing all language
                    false // Not unpublish action
                );
            }
        }
    }
);
