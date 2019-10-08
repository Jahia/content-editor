import {composeActions} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {reduxAction} from '~/actions/redux.action';
import {unpublishNode} from './unpublish.request';

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
        onClick: context => {
            unpublishNode({
                client: context.client,
                t: context.t,
                notificationContext: context.notificationContext,
                data: {
                    nodeData: context.nodeData,
                    language: context.language,
                    uiLang: context.uiLang
                }
            });
        }
    });
