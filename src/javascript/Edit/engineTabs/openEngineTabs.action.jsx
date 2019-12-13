import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {openEngineTab} from './engineTabs.utils';

export default composeActions(
    withFormikAction,
    {
        onClick: ({nodeData, tabs}) => {
            openEngineTab(nodeData, tabs);
        }
    }
);
