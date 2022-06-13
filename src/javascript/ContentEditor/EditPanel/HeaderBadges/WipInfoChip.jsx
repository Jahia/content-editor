import React from 'react';
import {Chip} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {Field} from 'formik';
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

export const WipInfoChip = () => {
    const {t} = useTranslation('content-editor');
    const {lang} = useContentEditorContext();

    return (
        <Field name={Constants.wip.fieldName}>
            {({field}) => (
                showChipHeader(field.value, lang) &&
                <Chip
                    data-sel-role="wip-info-chip"
                    label={getChipContent(field.value, lang, t)}
                />
            )}
        </Field>
    );
};
