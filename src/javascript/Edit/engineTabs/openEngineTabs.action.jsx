import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {openEngineTab} from './engineTabs.utils';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    withFormikAction,
    {
        onClick: ({nodeData, tabs}) => {
            openEngineTab(nodeData, tabs);
        }
    }
);
