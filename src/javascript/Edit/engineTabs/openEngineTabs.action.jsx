import {composeActions} from '@jahia/react-material';
import {openEngineTab} from './engineTabs.utils';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    {
        onClick: ({nodeData, tabs}) => {
            openEngineTab(nodeData, tabs);
        }
    }
);
