import mime from 'mime';

export const getPreviewContext = editorContext => {
    let path = editorContext.currentPage.path;
    const requestAttributes = [{
        name: 'ce_preview',
        value: editorContext.nodeData.uuid
    }];

    const requestParameters = [];

    if (path !== editorContext.path) {
        // If node type is a page we are editing a page without visiting it prior
        // We need to update the path to the one of the edited page and not the current page
        if (editorContext.nodeData.isPage) {
            path = editorContext.path;
        } else {
            path = decodeURIComponent(path);
        }
    }

    if (path !== editorContext.path && !editorContext.nodeData.isPage) {
        // If the path to preview is not the path of the content,
        // let's use the wrapper parameter to be able to zoom on the content
        requestAttributes.push({
            name: 'ce_preview_wrapper',
            value: editorContext.path
        });
    }

    // Request Parameters are not use for now
    // TODO: BACKLOG-15360
    if (editorContext.currentPage.queryString) {
        let queryString = editorContext.currentPage.queryString;
        if (queryString.startsWith('?')) {
            queryString = queryString.substring(1);
        }

        queryString.split('&').forEach(entry => {
            const param = entry.split('=');
            requestParameters.push({
                name: param[0],
                value: decodeURIComponent(param[1] || '')
            });
        });
    }

    return {
        path: path,
        workspace: 'edit',
        view: editorContext.currentPage.template,
        contextConfiguration: editorContext.currentPage.config,
        templateType: 'html',
        language: editorContext.lang,
        requestAttributes,
        requestParameters
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

export const isBrowserImage = function (node) {
    if (node.isFile) {
        let mimetype = node.content !== undefined ? node.content.mimeType.value : node.resourceChildren.nodes[0].mimeType.value;
        if (mimetype === 'application/binary' || mimetype === 'application/octet-stream') {
            switch (node.path.split('.').pop().toLowerCase()) {
                case 'avif':
                case 'png':
                case 'jpeg':
                case 'jpg':
                case 'gif':
                case 'svg':
                case 'img':
                case 'webp':
                case 'bmp':
                    return true;
                default:
                    return false;
            }
        } else {
            return mimetype.startsWith('image/');
        }
    }

    return false;
};

export const isPDF = function (node) {
    if (node.isFile) {
        let mimetype = node.content !== undefined ? node.content.mimeType.value : node.resourceChildren.nodes[0].mimeType.value;
        if (mimetype === 'application/binary' || mimetype === 'application/octet-stream') {
            switch (node.path.split('.').pop().toLowerCase()) {
                case 'pdf':
                    return true;
                default:
                    return false;
            }
        }

        return mimetype.toLowerCase().indexOf('pdf') > 0;
    }

    return false;
};

export const getFileType = function (node) {
    if (node.isFile) {
        let mimetype = node.content === undefined ? node.resourceChildren.nodes[0].mimeType.value : node.content.mimeType.value;
        if (mimetype === 'application/binary' || mimetype === 'application/octet-stream') {
            return node.path.split('.').pop().toLowerCase();
        }

        if (mimetype === 'audio/mpeg') {
            return 'mp3';
        }

        return mime.getExtension(mimetype);
    }
};
