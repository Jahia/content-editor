import {Constants} from '~/ContentEditor.constants';

export const hasToRenderAction = (actionName, mode) => {
    const actionCondition = {
        edit: true,
        advanced: mode === Constants.routes.baseEditRoute
    };

    return actionCondition[actionName];
};
