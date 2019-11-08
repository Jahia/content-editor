import {Constants} from '~/ContentEditor.constants';
import {unpublishNode} from './unpublish.request';

export default {
    init: context => {
        context.enabled = context.mode === Constants.routes.baseEditRoute &&
            context.nodeData.hasPublishPermission &&
            context.parent.publicationInfoContext.publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED;
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
};
