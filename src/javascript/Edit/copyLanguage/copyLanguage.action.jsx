import {composeActions, componentRendererAction} from '@jahia/react-material';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    componentRendererAction,
    {
        init: context => {
            context.enabled = context.siteInfo.languages.length > 1;
        },
        onClick: () => {
            // TODO BACKLOG-12537 open the modal
        }
    });
