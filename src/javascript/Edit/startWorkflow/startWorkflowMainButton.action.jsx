import {Constants} from '~/ContentEditor.constants';
import {composeActions} from '@jahia/react-material';
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
            !context.nodeData.hasPublishPermission &&
            context.nodeData.hasStartPublicationWorkflowPermission;
        },
        onClick: () => {
            // TODO BACKLOG-11379 implement the actions
        }
    }
);
