export const getPreviewContext = editorContext => {
    let view = 'cm';
    let config = 'module';
    let path = editorContext.path;
    let requestAttributes = [{
        name: 'ce_preview',
        value: editorContext.nodeData.uuid
    }];

    if (editorContext.nodeData.displayableNode && !editorContext.nodeData.displayableNode.isFolder) {
        path = editorContext.nodeData.displayableNode.path;
        config = 'page';
        view = 'default';

        if (path !== editorContext.path) {
            // Displayable node is a parent, let's use the wrapper parameter to be able zoom on the content
            requestAttributes.push({
                name: 'ce_preview_wrapper',
                value: editorContext.path
            });
        }
    }

    return {
        path: path,
        workspace: 'edit',
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

/**
 * Force the display of the HTML El, by checking if it's using display: node style
 * Recursive fct will check parents nodes aswell
 * @param element to force the display
 */
export const forceDisplay = element => {
    if (element.style.display === 'none') {
        element.style.display = '';
    }

    // Stop recursion if no parent, or body is parent
    if (element.parentNode && element.parentNode.tagName !== 'BODY') {
        forceDisplay(element.parentNode);
    }
};

export const isBrowserImage = function (filename) {
    switch (filename.split('.').pop().toLowerCase()) {
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'img':
        case 'svg':
        case 'bmp':
            return true;
        default:
            return false;
    }
};

export const isPDF = function (filename) {
    return filename.split('.').pop().toLowerCase() === 'pdf';
};

export const getFileType = function (filename) {
    return filename.split('.').pop().toLowerCase();
};
