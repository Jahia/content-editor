import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {openEngineTab} from '../OpenEngineTabs.utils';

export default composeActions(
    withFormikAction,
    {
        onClick: ({nodeData}) => {
            openEngineTab(nodeData, ['visibility']);
        }
    }
);
