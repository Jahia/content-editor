import {Constants} from '~/ContentEditor.constants';
import {composeActions} from '@jahia/react-material';
import {reduxAction} from '~/actions/redux.action';

const shouldEnableAction = (isMainButton, context) => {
    if (isMainButton) {
        return context.mode === Constants.routes.baseEditRoute &&
                            !context.nodeData.hasPublishPermission &&
                            context.nodeData.hasStartPublicationWorkflowPermission;
    }

    return context.mode === Constants.routes.baseEditRoute && context.nodeData.hasPublishPermission;
};

const mapStateToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    reduxAction(mapStateToContext),
    {
        init: context => {
            context.enabled = shouldEnableAction(context.isMainButton, context);
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
