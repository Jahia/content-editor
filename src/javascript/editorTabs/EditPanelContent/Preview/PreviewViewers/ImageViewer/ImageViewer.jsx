import React from 'react';
import PropTypes from 'prop-types';
import {CardMedia} from '@material-ui/core';
import clsx from 'clsx';
import styles from './ImageViewer.scss';

export const ImageViewer = ({file, isFullScreen, className}) => (
    <CardMedia className={clsx(styles.container, className, isFullScreen && styles.fullScreen)}
               data-cm-role="preview-image"
               image={file}
    />
);

ImageViewer.defaultProps = {
    className: '',
    isFullScreen: false
};

ImageViewer.propTypes = {
    file: PropTypes.string.isRequired,
    isFullScreen: PropTypes.bool,
    className: PropTypes.string
};
