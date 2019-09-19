export const getPreviewContext = editorContext => {
    let view = 'cm';
    let config = 'module';
    let path = editorContext.path;

    if (editorContext.nodeData.displayableNode && !editorContext.nodeData.displayableNode.isFolder) {
        path = editorContext.nodeData.displayableNode.path;
        config = 'page';
        view = 'default';
    }

    return {
        path: path,
        workspace: 'EDIT',
        view: view,
        contextConfiguration: config,
        templateType: 'html',
        language: editorContext.lang
    };
};
