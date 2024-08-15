const contextPath = (window.contextJsParameters && window.contextJsParameters.contextPath) || '';

const contentPrefix = `${contextPath}/cms/{mode}/{lang}`;
const filePrefix = `${contextPath}/files/{workspace}`;

// Find "URL" input in CKEditor dialog.
function getCKEditorUrlInputId(dialog) {
    if (!dialog) {
        return;
    }

    const hasUrl = dialog.getContentElement('info', 'url');
    return hasUrl ? 'url' : 'txtUrl';
}

export function fillCKEditorPicker(setUrl, dialog, contentPicker, pickerResult) {
    // Fill Dialog alt title
    const eltId = getCKEditorUrlInputId(dialog);

    const altElementId = dialog.getName() === 'image2' ? 'alt' : 'txtAlt';

    const contentElement = dialog.getContentElement('info', eltId === 'url' ? 'advTitle' : altElementId);

    if (contentElement !== undefined) {
        contentElement.setValue(pickerResult.name);
    }

    if (pickerResult.url) {
        setUrl(pickerResult.url);
    } else {
        // Wrap path to build Jahia url.
        const pathWithEncodedFileName = pickerResult.path.replace(/\/([^/]+\.[^/?#]+)(\?|#|$)/, (_, fileName, suffix) => `/${encodeURIComponent(fileName)}${suffix}`);
        setUrl(`${contentPicker ? contentPrefix : filePrefix}${pathWithEncodedFileName}${contentPicker ? '.html' : ''}`, {});
    }
}

export function getPickerValue(dialog) {
    const urlInputVal = dialog.getContentElement('info', getCKEditorUrlInputId(dialog))?.getValue() || '';
    const protocolVal = dialog.getContentElement('info', 'protocol')?.getValue() || '';

    const hasContentPrefix = urlInputVal.startsWith(contentPrefix);
    const hasFilePrefix = urlInputVal.startsWith(filePrefix);

    if (canParse(urlInputVal)) {
        return new URL(urlInputVal).toString();
    }

    if (canParse(`${protocolVal}${urlInputVal}`)) {
        return new URL(`${protocolVal}${urlInputVal}`).toString();
    }

    if (hasContentPrefix) {
        return decodeURIComponent(urlInputVal.substring(contentPrefix.length).slice(0, -('.html').length));
    }

    if (hasFilePrefix) {
        return decodeURIComponent(urlInputVal.substring(filePrefix.length));
    }

    return decodeURIComponent(urlInputVal);
}

function canParse(val) {
    try {
        return Boolean(new URL(val));
    } catch {
        return false;
    }
}
