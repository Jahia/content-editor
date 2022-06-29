import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Paper} from '@material-ui/core';
import styles from './IframeViewer.scss';
import {forceDisplay, removeSiblings} from '../../Preview.utils';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {useTranslation} from 'react-i18next';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

export function zoom(iframeDocument, onContentNotFound, editorContext) {
    const isPage = editorContext.nodeData.isPage;
    const isContentTemplate = editorContext.nodeData.displayableNode && editorContext.nodeData.displayableNode.path === editorContext.nodeData.path;

    if (iframeDocument.documentElement && iframeDocument.documentElement.innerHTML && !iframeDocument.documentElement.innerHTML.includes('ce_preview_skip_zoom')) {
        const contentPreview = iframeDocument.getElementById('ce_preview_content');
        if (contentPreview) {
            removeSiblings(contentPreview);
            forceDisplay(contentPreview);
            // Ce_preview-content id doesn't exist on page
        } else if (!isPage && !isContentTemplate) {
            onContentNotFound();
        }
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

function loadAssets(assets, iframeDocument) {
    if (!assets || assets.length === 0) {
        return Promise.resolve();
    }

    let iframeHeadEl = iframeDocument.getElementsByTagName('head')[0];
    if (!iframeHeadEl) {
        iframeDocument.getElementsByTagName('html')[0].insertBefore(iframeDocument.createElement('head'), iframeDocument.body);
        iframeHeadEl = iframeDocument.getElementsByTagName('head')[0];
    }

    return Promise.all(assets.map(asset => loadAsset(asset, iframeHeadEl)));
}

function writeInIframe(html, iframeWindow) {
    return new Promise((resolve, reject) => {
        iframeWindow.document.open();
        iframeWindow.onload = resolve;
        iframeWindow.onerror = reject;
        iframeWindow.document.write(html);
        iframeWindow.document.close();
    });
}

export const IframeViewer = ({previewContext, data, onContentNotFound}) => {
    const [loading, setLoading] = useState(true);
    const editorContext = useContentEditorContext();
    const {t} = useTranslation('content-editor');
    const iframeRef = useRef(null);

    const renderIFrame = useCallback(() => {
        const element = iframeRef.current;

        if (!element) {
            return;
        }

        setLoading(true);
        let displayValue = data && data.nodeByPath && data.nodeByPath.renderedContent ? data.nodeByPath.renderedContent.output : '';
        if (displayValue === '') {
            displayValue = t('label.contentManager.contentPreview.noViewAvailable');
        }

        const iframeWindow = element.contentWindow || element;
        writeInIframe(displayValue, iframeWindow)
            .then(() => {
                iframeWindow.document.body.setAttribute('style', 'pointer-events: none');
            })
            .then(() => {
                const assets = data && data.nodeByPath && data.nodeByPath.renderedContent ?
                    data.nodeByPath.renderedContent.staticAssets :
                    [];
                return loadAssets(assets, iframeWindow.document);
            })
            .catch(err => console.error('Error in the preview', err))
            .then(() => {
                // No zoom on full if no content wrapped in the page
                if (previewContext.requestAttributes) {
                    zoom(iframeWindow.document, onContentNotFound, editorContext);
                }
            })
            .then(() => {
                setLoading(false);
            });
    }, [data, editorContext, onContentNotFound, previewContext.requestAttributes, t]);

    useEffect(() => {
        renderIFrame();
    }, [renderIFrame]);

    return (
        <Paper elevation={1} classes={{root: styles.contentPaper}}>
            {loading && <LoaderOverlay/>}
            <iframe ref={iframeRef}
                    aria-labelledby="preview-tab"
                    data-sel-role={previewContext.workspace + '-preview-frame'}
                    className={`${styles.iframe} ${loading ? styles.iframeLoading : ''}`}
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
