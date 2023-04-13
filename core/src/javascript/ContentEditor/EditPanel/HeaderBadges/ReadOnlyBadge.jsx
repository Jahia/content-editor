import React from 'react';
import PropTypes from 'prop-types';
import {Chip, Visibility} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './ReadOnlyBadge.scss';
import {useContentEditorContext, useContentEditorSectionContext} from '~/contexts';

export const ReadOnlyBadge = ({isGlobal, readOnly}) => {
    const {t} = useTranslation('content-editor');
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();

    const hasNotReadOnlySection = sections.find(s => s.fieldSets.find(fs => fs.fields.find(f => !f.readOnly)));

    const badge = (
        <Chip className={styles.badge}
              data-sel-role="read-only-badge"
              label={t('content-editor:label.contentEditor.readOnly')}
              icon={<Visibility/>}
              color="warning"
        />
    );

    if (isGlobal && (nodeData.lockedAndCannotBeEdited || !hasNotReadOnlySection)) {
        return badge;
    }

    if (readOnly && !(nodeData.lockedAndCannotBeEdited || !hasNotReadOnlySection)) {
        return badge;
    }

    return null;
};

ReadOnlyBadge.propTypes = {
    isGlobal: PropTypes.bool,
    readOnly: PropTypes.bool
};
