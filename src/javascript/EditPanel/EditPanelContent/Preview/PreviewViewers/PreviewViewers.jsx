import React from 'react';
import PropTypes from 'prop-types';
import {getFileType, isBrowserImage, isPDF} from '../Preview.utils';
import classNames from 'classnames';
import classes from './PreviewViewers.scss';

import DocumentViewer from './DocumentViewer';
import PDFViewer from './PDFViewer';
import ImageViewer from './ImageViewer';
import {IframeViewer} from './IframeViewer';

export const PreviewViewer = ({data, previewContext, onContentNotFound}) => {
    // If node type is "jnt:file" use specific viewer
    const isFile = data && data.nodeByPath && data.nodeByPath.lastModified && data.nodeByPath.isFile;
    if (isFile) {
        const file = window.contextJsParameters.contextPath + '/files/' + (previewContext.workspace === 'edit' ? 'default' : 'live') + data.nodeByPath.path.replace(/[^/]/g, encodeURIComponent) + (data.nodeByPath.lastModified ? ('?lastModified=' + data.nodeByPath.lastModified.value) : '');
        if (isPDF(data.nodeByPath.path)) {
            return (
                <div className={classes.previewContainer} data-sel-role="preview-type-pdf">
                    <PDFViewer file={file} isFullScreen={false}/>
                </div>
            );
        }

        if (isBrowserImage(data.nodeByPath.path)) {
            return (
                <div className={classNames(classes.previewContainer, classes.mediaContainer)}
                     data-sel-role="preview-type-image"
                >
                    <ImageViewer file={file} fullScreen={false}/>
                </div>
            );
        }

        const type = getFileType(data.nodeByPath.path);
        const isMedia = (type === 'avi' || type === 'mp4' || type === 'video');
        return (
            <div className={classNames(classes.previewContainer, isMedia && classes.mediaContainer)}
                 data-sel-role="preview-type-document"
            >
                <DocumentViewer file={file} type={type} fullScreen={false}/>
            </div>
        );
    }

    return (
        <div className={classNames(classes.previewContainer, classes.contentContainer)}
             data-sel-role="preview-type-content"
        >
            <IframeViewer
                data={data}
                previewContext={previewContext}
                onContentNotFound={onContentNotFound}
                />
        </div>
    );
};

PreviewViewer.propTypes = {
    data: PropTypes.object.isRequired,
    previewContext: PropTypes.shape({
        workspace: PropTypes.string.isRequired
    }).isRequired,
    onContentNotFound: PropTypes.func.isRequired
};
