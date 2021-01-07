import React from 'react';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import classes from './TechnicalInformation.scss';
import {InfoPanel} from '~/DesignSystem/InfoPanel';

export const TechnicalInformation = () => {
    const {t} = useTranslation('content-editor');

    const {details, technicalInfo} = useContentEditorContext();

    return (
        <section data-sel-details-section className={classes.container}>
            <InfoPanel
                panelTitle={t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.details')}
                infos={details}
            />
            <InfoPanel
                panelTitle={t(
                    'content-editor:label.contentEditor.edit.advancedOption.technicalInformation.label'
                )}
                variant="oneColumn"
                infos={technicalInfo}
            />
        </section>
    );
};
