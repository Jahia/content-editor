import React from 'react';
import PropTypes from 'prop-types';
import {FileIcon} from '@jahia/icons';
import clsx from 'clsx';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import styles from './DocumentViewer.scss';

const FileViewer = React.lazy(() => import(/* webpackChunkName: "reactFileViewer" */ 'react-file-viewer'));

export const DocumentViewer = ({file, type, isFullScreen}) => (
    <React.Suspense fallback={<LoaderOverlay/>}>
        <div className={clsx(styles.container, isFullScreen && styles.fullScreen)}>
            {(type === 'docx' || type === 'xlsx' || type === 'csv' || type === 'webm' || type === 'mp4' || type === 'mp3') ? (
                <FileViewer fileType={type} filePath={file}/>
            ) : (
                <FileIcon filename={file} color="disabled" classes={{root: styles.icon}}/>
            )}
        </div>
    </React.Suspense>
);

DocumentViewer.propTypes = {
    file: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isFullScreen: PropTypes.bool
};

DocumentViewer.defaultProps = {
    isFullScreen: false
};
