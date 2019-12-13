import {Constants} from '~/ContentEditor.constants';

let editRestrictedAction = {
    init: context => {
        context.enabled = context.mode === Constants.routes.baseEditRoute;
    }
};

export {editRestrictedAction};
