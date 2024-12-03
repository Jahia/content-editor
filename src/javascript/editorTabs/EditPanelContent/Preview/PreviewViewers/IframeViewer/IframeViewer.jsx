import React, {useEffect, useRef, useState} from 'react';
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

export const IframeViewer = ({previewContext, data, onContentNotFound}) => {
    const [loading, setLoading] = useState(true);
    const editorContext = useContentEditorContext();
    const {t} = useTranslation('content-editor');
    const iframeRef = useRef(null);
    const onLoadTimeoutRef = useRef(null);
    let displayValue = data && data.nodeByPath && data.nodeByPath.renderedContent ? data.nodeByPath.renderedContent.output : '';
    if (displayValue === '') {
        displayValue = t('label.contentManager.contentPreview.noViewAvailable');
    }

    useEffect(() => {
        // Add a timer to always remove the loader and click on links after 5 seconds
        onLoadTimeoutRef.current = setTimeout(() => {
            console.debug('iframe onLoad did not trigger, remove loader and disable click events');
            const element = iframeRef.current;
            const iframeWindow = element.contentWindow || element;
            iframeWindow.document.body.setAttribute('style', 'pointer-events: none');
            setLoading(false);
        }, 5000);
        return () => clearTimeout(onLoadTimeoutRef.current);
    }, []);

    const onLoad = () => {
        try {
            console.debug('Preview loaded, add assets and remove loader');
            const element = iframeRef.current;
            const iframeWindow = element.contentWindow || element;
            iframeWindow.document.body.setAttribute('style', 'pointer-events: none');

            const assets = data && data.nodeByPath && data.nodeByPath.renderedContent ?
                data.nodeByPath.renderedContent.staticAssets : [];
            loadAssets(assets, iframeWindow.document);

            if (previewContext.requestAttributes) {
                zoom(iframeWindow.document, onContentNotFound, editorContext);
            }
        } catch (e) {
            console.error('Error while processing preview', e);
        }

        setLoading(false);
        clearTimeout(onLoadTimeoutRef.current);
    };

    return (
        <Paper elevation={1} classes={{root: styles.contentPaper}}>
            {loading && <LoaderOverlay/>}
            <iframe ref={iframeRef}
                    aria-labelledby="preview-tab"
                    data-sel-role={previewContext.workspace + '-preview-frame'}
                    className={`${styles.iframe} ${loading ? styles.iframeLoading : ''}`}
                    srcDoc={displayValue}
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={onLoad}
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
