import React from 'react';
import {Chip, Visibility} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './ReadOnlyBadge.scss';

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
