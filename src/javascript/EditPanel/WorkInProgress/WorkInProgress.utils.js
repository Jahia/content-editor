const WIP_STATUS_ALL_CONTENT = 'ALL_CONTENT';
const WIP_STATUS_LANGUAGES = 'LANGUAGES';

export const getChipContent = (nodeData, currentLanguage, t) => {
    if (nodeData.wipInfo.status === WIP_STATUS_ALL_CONTENT) {
        return t('content-editor:label.contentEditor.edit.action.workInProgress.chipLabelAllContent');
    }

    return t('content-editor:label.contentEditor.edit.action.workInProgress.chipLabelLanguages') + currentLanguage.toUpperCase();
};

export const showChipHeader = (nodeData, currentLanguage) => {
    if (nodeData.wipInfo) {
        const shouldShowForCurrentLanguage = nodeData.wipInfo.status === WIP_STATUS_LANGUAGES && nodeData.wipInfo.languages.indexOf(currentLanguage) > -1;
        return nodeData.wipInfo.status === WIP_STATUS_ALL_CONTENT || shouldShowForCurrentLanguage;
    }

    return false;
};

export const showChipField = (is18nField, nodeData, currentLanguage) => {
    return is18nField && nodeData.wipInfo && nodeData.wipInfo.status === WIP_STATUS_LANGUAGES && nodeData.wipInfo.languages.indexOf(currentLanguage) > -1;
};
