import {composeActions} from '@jahia/react-material';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    {
        init: () => {},
        onClick: context => {
            context.setActiveOption(context.value);
        }
    }
);
