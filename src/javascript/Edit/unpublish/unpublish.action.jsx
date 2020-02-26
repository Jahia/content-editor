import {Constants} from '~/ContentEditor.constants';
import {unpublishNode} from './unpublish.request';
import {composeActions} from '@jahia/react-material';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    {
        init: context => {
            context.enabled = context.enabled &&
                context.nodeData.hasPublishPermission &&
                context.publicationInfoContext.publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED;
        },
        onClick: context => {
            if (context.enabled) {
                unpublishNode({
                    client: context.client,
                    t: context.t,
                    notificationContext: context.notificationContext,
                    data: {
                        nodeData: context.nodeData,
                        language: context.language,
                        uilang: context.uilang
                    }
                });
            }
        }
    }
);
