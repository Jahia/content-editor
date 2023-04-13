import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {PreviewFetcher} from './Preview.fetcher';
import {useContentPreview} from '@jahia/data-helper';
import {useContentEditorContext} from '~/contexts/ContentEditor';

jest.mock('@jahia/data-helper', () => {
    return {
        useContentPreview: jest.fn(() => ({
            data: {},
            loading: false,
            error: null
        }))
    };
});

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => ({
    useContentEditorContext: jest.fn()
}));

jest.mock('./Preview.utils', () => {
    return {
        getPreviewContext: () => ({
            path: '/site/digitall',
            workspace: 'edit',
            language: 'fr',
            templateType: 'normal',
            view: 'aLaTV',
            contextConfiguration: 'conf',
            requestAttributes: []
        }),
        removeSiblings: jest.fn(),
        forceDisplay: jest.fn()
    };
});

describe('Preview fetcher', () => {
    let contentEditorContext;
    beforeEach(() => {
        contentEditorContext = {
            path: '/site/digitall',
            lang: 'fr',
            nodeData: {
                displayableNode: null
            }
        };
        useContentEditorContext.mockImplementation(() => contentEditorContext);
    });

    it('should display the preview with the provided path', () => {
        shallowWithTheme(
            <PreviewFetcher onContentNotFound={jest.fn()}/>,
            {},
            dsGenericTheme
        );
        const hookArgs = useContentPreview.mock.calls[0][0];
        expect(hookArgs.language).toBe('fr');
        expect(hookArgs.path).toBe('/site/digitall');
        expect(hookArgs.workspace).toBe('edit');
    });
});
