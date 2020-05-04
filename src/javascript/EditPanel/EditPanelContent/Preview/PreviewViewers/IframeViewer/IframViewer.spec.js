import React from 'react';
import {zoom, IframeViewer} from './';
import {shallow} from '@jahia/test-framework';

const mockRemoveSiblings = jest.fn(() => {});

jest.mock('../../Preview.utils', () => (
    {
        removeSiblings: () => mockRemoveSiblings(),
        forceDisplay: () => {
        }
    })
);

describe('IframeViewer', () => {
    let props;
    beforeEach(() => {
        props = {
            previewContext: {
                workspace: 'hello'
            },
            onContentNotFound: jest.fn(),
            data: {}
        };
    });

    it('should display a loader while content is not fully initialized', () => {
        const cmp = shallow(<IframeViewer {...props}/>);
        expect(cmp.find('WithStyles(ProgressOverlayCmp)').exists()).toBe(true);
    });
});

describe('Zoom test', () => {
    let iframeDocument;
    let onContentNotFound = jest.fn();
    let editorContext;

    let getElementById = true;

    beforeEach(() => {
        mockRemoveSiblings.mockClear();
        onContentNotFound.mockClear();
        iframeDocument = {
            documentElement: {innerHTML: []},
            getElementById: () => getElementById
        };
        editorContext = {
            nodeData: {
                isPage: false,
                displayableNode: {
                    path: '/top'
                },
                path: '/top/down'
            }
        };
    });

    it('Zoom should find item to zoom in for normal content', () => {
        zoom(iframeDocument, onContentNotFound, editorContext);
        expect(mockRemoveSiblings).toHaveBeenCalled();
        expect(onContentNotFound).not.toHaveBeenCalled();
    });

    it('Zoom should not find item to zoom in - if zoom skipped', () => {
        iframeDocument.documentElement.innerHTML = ['ce_preview_skip_zoom'];
        zoom(iframeDocument, onContentNotFound, editorContext);
        expect(mockRemoveSiblings).not.toHaveBeenCalled();
        expect(onContentNotFound).not.toHaveBeenCalled();
    });

    it('Zoom should display badge - if tag not found and is not a page nor a content template (not same path)', () => {
        getElementById = false;
        editorContext.nodeData.isPage = false;

        zoom(iframeDocument, onContentNotFound, editorContext);
        expect(mockRemoveSiblings).not.toHaveBeenCalled();
        expect(onContentNotFound).toHaveBeenCalled();
    });

    it('Zoom should display badge - if tag not found and not a page nor a content template (no display node)', () => {
        getElementById = false;
        editorContext.nodeData.isPage = false;
        editorContext.nodeData.displayableNode = undefined;

        zoom(iframeDocument, onContentNotFound, editorContext);
        expect(mockRemoveSiblings).not.toHaveBeenCalled();
        expect(onContentNotFound).toHaveBeenCalled();
    });

    it('Zoom should NOT display badge - if tag not found and is a content template', () => {
        getElementById = false;
        editorContext.nodeData.isPage = false;
        editorContext.nodeData.path = '/top';

        zoom(iframeDocument, onContentNotFound, editorContext);
        expect(mockRemoveSiblings).not.toHaveBeenCalled();
        expect(onContentNotFound).not.toHaveBeenCalled();
    });

    it('Zoom should NOT display badge - if tag not found and is a page', () => {
        getElementById = false;
        editorContext.nodeData.isPage = true;

        zoom(iframeDocument, onContentNotFound, editorContext);
        expect(mockRemoveSiblings).not.toHaveBeenCalled();
        expect(onContentNotFound).not.toHaveBeenCalled();
    });
});
