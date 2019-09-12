import {Constants} from '~/ContentEditor.constants';

export const openInTabAction = {
    onClick({fieldData, editorContext, dxContext}) {
        const splitPath = fieldData.path.split('/');
        if (splitPath.length > 2 && splitPath[1] === 'sites') {
            const siteKey = splitPath[2];
            const relativeNodePath = splitPath.splice(3).join('/');

            window.open(`${dxContext.contextPath}${dxContext.urlBrowser}/${siteKey}/${editorContext.lang}/${Constants.routes.baseEditRoute}/${relativeNodePath}`, '_blank');
        }
    }
};
