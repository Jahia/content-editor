import {Constants} from '~/ContentEditor.constants';
import {composeActions} from '@jahia/react-material';
import {reduxAction} from '~/actions/redux.action';
import {withFormikAction} from '../../actions/withFormik.action';

const mapStateToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    withFormikAction,
    reduxAction(mapStateToContext),
    {
        init: context => {
            if (context.isMainButton) {
                context.enabled = context.mode === Constants.routes.baseEditRoute &&
                    !context.nodeData.hasPublishPermission &&
                    context.nodeData.hasStartPublicationWorkflowPermission;
                context.disabled = context.nodeData.lockInfo.isLocked || context.formik.dirty;
            } else {
                context.enabled = context.mode === Constants.routes.baseEditRoute && context.nodeData.hasPublishPermission;

                // In case the action is in the menu, formik is in parent context
                if (context.enabled && (context.nodeData.lockInfo.isLocked || context.parent.formik.dirty)) {
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
