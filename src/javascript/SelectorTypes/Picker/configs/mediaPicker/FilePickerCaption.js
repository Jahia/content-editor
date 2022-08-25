import clsx from 'clsx';
import styles from '~/SelectorTypes/Picker/PickerDialog/RightPanel/PickerSelection/Selection';
import {Typography} from '@jahia/moonstone';
import bytes from 'bytes';
import React from 'react';
import {NodeIcon} from '@jahia/jcontent';
import PropTypes from 'prop-types';

export const FilePickerCaption = ({selection}) => (
    <>
        <div className={clsx('flexRow_nowrap', 'alignCenter', styles.text)} data-sel-role="item-selected">
            <NodeIcon node={selection}/>
            <Typography isNowrap variant="body">{selection.displayName}</Typography>
            <Typography className={styles.gray}
                        variant="body"> - {bytes(selection.children.nodes[0]?.data?.size, {unitSeparator: ' '})}</Typography>
        </div>
        <Typography className={styles.gray} variant="caption">{selection.path}</Typography>
    </>
);

FilePickerCaption.propTypes = {
    selection: PropTypes.object.isRequired
};
