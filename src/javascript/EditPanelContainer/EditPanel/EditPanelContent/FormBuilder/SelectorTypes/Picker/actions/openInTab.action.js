export const openInTabAction = {
    onClick({fieldData, editorContext}) {
        const site = fieldData.path.split('/')[2];
        const nodePath = fieldData.path.split('/').splice(3).join('/');
        window.open(`/cms/contentmanager/${site}/${editorContext.lang}/edit/${nodePath}`, '_blank');
    }
};
