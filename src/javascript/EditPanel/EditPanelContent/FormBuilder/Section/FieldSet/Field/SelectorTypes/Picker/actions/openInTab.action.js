import {Constants} from '~/ContentEditor.constants';

export const openInTabAction = {
    onClick({fieldData, editorContext}) {
        window.open(`${window.contextJsParameters.urlbase}/${Constants.appName}/${editorContext.lang}/${Constants.routes.baseEditRoute}/${fieldData.uuid}`, '_blank');
    }
};
