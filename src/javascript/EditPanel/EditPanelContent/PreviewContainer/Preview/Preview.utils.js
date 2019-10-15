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
        requestAttributes
    };
};

export const getPreviewPath = nodeData => {
    if (nodeData.displayableNode && !nodeData.displayableNode.isFolder) {
        return nodeData.displayableNode.path;
    }

    return nodeData.path;
};

export const getSiblings = function (elem) {
    let siblings = [];
    let sibling = elem.parentNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem && sibling.tagName !== 'LINK' && sibling.tagName !== 'SCRIPT') {
            siblings.push(sibling);
        }

        sibling = sibling.nextSibling;
    }

    return siblings;
};

export const removeSiblings = element => {
    for (const sibling of getSiblings(element)) {
        element.parentNode.removeChild(sibling);
    }

    // Stop recursion if no parent, or body is parent
    if (element.parentNode && element.parentNode.tagName !== 'BODY') {
        removeSiblings(element.parentNode);
    }
};
