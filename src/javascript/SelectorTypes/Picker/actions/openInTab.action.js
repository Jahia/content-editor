import {Constants} from '~/ContentEditor.constants';

export const openInTabAction = {
    init: context => {
        context.key = 'openInNewTab';
    }, onClick({fieldData, editorContext}) {
        window.open(`${window.contextJsParameters.urlbase}/${Constants.appName}/${editorContext.lang}/${Constants.routes.baseEditRoute}/${fieldData.uuid}`, '_blank');
    }
};
