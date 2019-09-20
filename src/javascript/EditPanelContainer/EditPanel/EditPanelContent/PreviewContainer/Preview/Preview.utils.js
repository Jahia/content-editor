export const getPreviewContext = editorContext => {
    let view = 'cm';
    let config = 'module';
    let path = editorContext.path;
    let requestAttributes = null;

    if (editorContext.nodeData.displayableNode && !editorContext.nodeData.displayableNode.isFolder) {
        path = editorContext.nodeData.displayableNode.path;
        config = 'page';
        view = 'default';

        if (path !== editorContext.path) {
            // Displayable node is a parent, let's use the wrapper parameter to be able zoom on the content
            requestAttributes = [{
                name: 'ce_preview_wrapper',
                value: editorContext.path
            }];
        }
    }

    return {
        path: path,
        workspace: 'EDIT',
        view: view,
        contextConfiguration: config,
        templateType: 'html',
        language: editorContext.lang,
        requestAttributes: requestAttributes
    };
};
