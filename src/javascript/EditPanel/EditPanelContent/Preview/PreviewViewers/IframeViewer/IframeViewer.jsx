import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Paper} from '@material-ui/core';
import classes from './IframeViewer.scss';
import {forceDisplay, removeSiblings} from '../../Preview.utils';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useTranslation} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';

function zoom(frameDoc, onContentNotFound, editorContext) {
    const contentPreview = frameDoc.getElementById('ce_preview_content');
    if (contentPreview) {
        removeSiblings(contentPreview);
        forceDisplay(contentPreview);
        // Ce_preview-content id doesn't exist on page
    } else if (!editorContext.nodeData.isPage) {
        onContentNotFound();
    }
}

function loadAsset(asset, iframeHeadEl) {
    return new Promise(resolve => {
        const linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.type = 'text/css';
        linkEl.href = asset.key;
        linkEl.onload = resolve;

        iframeHeadEl.appendChild(linkEl);
    });
}

function loadAssets(assets, frameDoc) {
    if (!assets || assets.length === 0) {
        return Promise.resolve();
    }

    let iframeHeadEl = frameDoc.getElementsByTagName('head')[0];
    if (!iframeHeadEl) {
        frameDoc.getElementsByTagName('html')[0].insertBefore(frameDoc.createElement('head'), frameDoc.body);
        iframeHeadEl = frameDoc.getElementsByTagName('head')[0];
    }

    return Promise.all(assets.map(asset => loadAsset(asset, iframeHeadEl)));
}

export const IframeViewer = ({previewContext, data, onContentNotFound}) => {
    const [loading, setLoading] = useState(true);
    const editorContext = useContentEditorContext();
    const {t} = useTranslation();
    const iframeRef = useRef(null);

    useEffect(() => {
        const element = iframeRef.current;

        if (!element) {
            return;
        }

        let displayValue = data && data.nodeByPath && data.nodeByPath.renderedContent ? data.nodeByPath.renderedContent.output : '';
        if (displayValue === '') {
            displayValue = t('label.contentManager.contentPreview.noViewAvailable');
        }

        const frameDoc = element.contentWindow ? element.contentWindow.document : element.document;

        frameDoc.body.innerHTML = displayValue;
        frameDoc.body.setAttribute('style', 'pointer-events: none');

        const assets = data && data.nodeByPath && data.nodeByPath.renderedContent ?
            data.nodeByPath.renderedContent.staticAssets :
            [];

        loadAssets(assets, frameDoc)
            .then(() => {
                // No zoom on full if no content wrapped in the page
                if (previewContext.requestAttributes) {
                    zoom(frameDoc, onContentNotFound, editorContext);
                }
            })
            .then(() => {
                setLoading(false);
            });
    }, [data, onContentNotFound, editorContext, previewContext, t]);

    return (
        <Paper elevation={1} classes={{root: classes.contentPaper}}>
            {loading && <ProgressOverlay/>}
            <iframe ref={iframeRef}
                    aria-labelledby="preview-tab"
                    data-sel-role={previewContext.workspace + '-preview-frame'}
                    className={`${classes.iframe} ${loading ? classes.iframeLoading : ''}`}
                />
        </Paper>
    );
};

IframeViewer.propTypes = {
    previewContext: PropTypes.shape({
        workspace: PropTypes.string.isRequired,
        requestAttributes: PropTypes.array
    }).isRequired,
    onContentNotFound: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};
