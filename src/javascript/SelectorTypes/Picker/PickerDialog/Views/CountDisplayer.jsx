import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/design-system-kit';
import {useTranslation} from 'react-i18next';
import styles from './CountDisplayer.scss';

export const CountDisplayer = ({totalCount}) => {
    const {t} = useTranslation('content-editor');

    return (
        <div className={styles.itemsFoundLabel} data-sel-total-count={totalCount}>
            <Typography color="gamma" variant="omega">
                {t('content-editor:label.contentEditor.edit.fields.contentPicker.itemsFound', {totalCount: totalCount})}
            </Typography>
        </div>
    );
};

CountDisplayer.propTypes = {
    totalCount: PropTypes.number.isRequired
};
