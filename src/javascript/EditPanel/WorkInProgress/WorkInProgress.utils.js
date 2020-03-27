import {Constants} from '~/ContentEditor.constants';

export const getChipContent = (wipInfo, currentLanguage, t) => {
    if (wipInfo.status === Constants.wip.status.ALL_CONTENT) {
        return t('content-editor:label.contentEditor.edit.action.workInProgress.chipLabelAllContent');
    }

    return t('content-editor:label.contentEditor.edit.action.workInProgress.chipLabelLanguages') + currentLanguage.toUpperCase();
};

export const showChipHeader = (wipInfo, currentLanguage) => {
    const shouldShowForCurrentLanguage = wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.indexOf(currentLanguage) > -1;
    return wipInfo.status === Constants.wip.status.ALL_CONTENT || shouldShowForCurrentLanguage;
};

export const showChipField = (is18nField, wipInfo, currentLanguage) => {
    return is18nField && wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.indexOf(currentLanguage) > -1;
};
