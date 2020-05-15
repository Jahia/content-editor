import {composeActions} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {publishNode} from './publish.request';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    {
        init: context => {
            context.enabled = context.enabled && context.nodeData.hasPublishPermission;

            if (context.enabled) {
                if (context.publicationInfoContext.publicationInfoPolling && context.publicationInfoContext.publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED) {
                    context.publicationInfoContext.stopPublicationInfoPolling();
                }

                const wipInfo = context.formik.values[Constants.wip.fieldName];
                context.disabled = context.publicationInfoContext.publicationStatus === undefined ||
                    context.publicationInfoContext.publicationInfoPolling ||
                    context.nodeData.lockedAndCannotBeEdited ||
                    context.formik.dirty ||
                    wipInfo.status === Constants.wip.status.ALL_CONTENT ||
                    (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(context.language)) ||
                    [
                        Constants.editPanel.publicationStatus.PUBLISHED,
                        Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
                    ].includes(context.publicationInfoContext.publicationStatus);

                context.buttonLabel = context.publicationInfoContext.publicationInfoPolling ?
                    'content-editor:label.contentEditor.edit.action.publish.namePolling' :
                    'content-editor:label.contentEditor.edit.action.publish.name';
            }
        },
        onClick: context => {
            publishNode({
                client: context.client,
                t: context.t,
                notificationContext: context.notificationContext,
                data: {
                    nodeData: context.nodeData,
                    language: context.language
                },
                successCallback: context.publicationInfoContext.startPublicationInfoPolling()
            });
        }
    });
