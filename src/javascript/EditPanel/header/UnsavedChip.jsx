import {useFormikContext} from 'formik';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {Constants} from '~/ContentEditor.constants';
import {Chip, Edit} from '@jahia/moonstone';
import React from 'react';

export const UnsavedChip = () => {
    const formik = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {mode} = useContentEditorContext();

    return (formik.dirty || mode === Constants.routes.baseCreateRoute) && (
        <Chip
            icon={<Edit/>}
            data-sel-role="unsaved-info-chip"
            label={t('content-editor:label.contentEditor.header.chips.unsavedLabel')}
            color="warning"
        />
    );
};
