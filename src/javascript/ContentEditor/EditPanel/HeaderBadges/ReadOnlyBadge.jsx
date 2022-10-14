import React from 'react';
import {Chip, Visibility} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {useSelector} from 'react-redux';
import styles from './ReadOnlyBadge.scss';

export const ReadOnlyBadgeGlobal = () => {
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const sectionToggleStates = useSelector(state => state.contenteditor.ceToggleSections);

    const sectionsWithReadOnlyFields = sections.reduce((acc, s) => {
        if (s.fieldSets.find(fs => fs.fields.find(f => f.readOnly))) {
            acc.push(s.name);
        }

        return acc;
    }, []);

    if ((sectionsWithReadOnlyFields.length > 0 && !sectionsWithReadOnlyFields.find(s => sectionToggleStates[s])) || nodeData.lockedAndCannotBeEdited) {
        return <ReadOnlyBadge/>;
    }

    return null;
};

export const ReadOnlyBadge = () => {
    const {t} = useTranslation('content-editor');

    return (
        <Chip
            className={styles.badge}
            data-sel-role="lock-info-badge"
            label={t('content-editor:label.contentEditor.readOnly')}
            icon={<Visibility/>}
            color="warning"
        />
    );
};
