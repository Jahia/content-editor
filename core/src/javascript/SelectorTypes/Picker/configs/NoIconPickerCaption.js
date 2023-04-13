import clsx from 'clsx';
import styles from '~/SelectorTypes/Picker/PickerDialog/RightPanel/PickerSelection/Selection.scss';
import {Typography} from '@jahia/moonstone';
import React from 'react';
import PropTypes from 'prop-types';

export const NoIconPickerCaption = ({selection}) => (
    <>
        <div className={clsx('flexRow_nowrap', 'alignCenter', styles.text)} data-sel-role="item-selected">
            <Typography isNowrap variant="body">{selection.displayName}</Typography>
        </div>
        <Typography className={styles.gray} variant="caption">{selection.path}</Typography>
    </>
);

NoIconPickerCaption.propTypes = {
    selection: PropTypes.object.isRequired
};
