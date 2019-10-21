import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '../../actions/withFormik.action';
import {Constants} from '~/ContentEditor.constants';
import {reduxAction} from '~/actions/redux.action';
import {publishNode} from './publish.request';

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
            context.enabled = context.mode === Constants.routes.baseEditRoute && context.nodeData.hasPublishPermission;

            if (context.enabled) {
                context.disabled = context.nodeData.lockInfo.isLocked || context.formik.dirty || [
                    Constants.editPanel.publicationStatus.PUBLISHED,
                    Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
                ].includes(context.nodeData.aggregatedPublicationInfo.publicationStatus);
            }
        },
        onClick: context => {
            publishNode({
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
