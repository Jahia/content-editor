import React from 'react';
import {Chip} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {getChipContent, showChipHeader} from '~/EditPanel/WorkInProgress/WorkInProgress.utils';
import {Field} from 'formik';
import {Constants} from '~/ContentEditor.constants';

export const WipInfoChip = () => {
    const {t} = useTranslation();
    const {lang} = useContentEditorContext();

    return (
        <Field name={Constants.wip.fieldName}
               render={({field}) => {
                   return showChipHeader(field.value, lang) &&
                       <Chip
                           data-sel-role="wip-info-chip"
                           label={getChipContent(field.value, lang, t)}
                       />;
               }}
        />
    );
};

export default WipInfoChip;
