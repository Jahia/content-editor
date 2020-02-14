import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ContentPreviewMemoWrapper} from './ContentPreviewMemoWrapper';

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(
    path.resolve(__dirname, './Preview.utils.test.html'),
    'utf8'
);

jest.mock('@jahia/data-helper', () => {
    return {
        useContentPreview: jest.fn(() => ({
            data: {},
            loading: false,
            error: null
        }))
    };
});
import {useContentPreview} from '@jahia/data-helper';

jest.mock('~/ContentEditor.context', () => ({
    useContentEditorContext: () => ({
        path: '/site/digitall',
        lang: 'fr',
        nodeData: {
            displayableNode: null
        }
    })
}));

jest.mock('./Preview.utils', () => {
    return {
        getPreviewContext: () => ({
            path: '/site/digitall',
            workspace: 'EDIT',
            language: 'fr',
            templateType: 'normal',
            view: 'aLaTV',
            contextConfiguration: 'conf',
            requestAttributes: []
        }),
        removeSiblings: jest.fn()
    };
});

describe('ContentPreviewMemoWrapper', () => {
    it('should display the preview with the provided path', () => {
        shallowWithTheme(
            <ContentPreviewMemoWrapper/>,
            {},
            dsGenericTheme
        )
            .dive();
        const hookArgs = useContentPreview.mock.calls[0][0];
        expect(hookArgs.language).toBe('fr');
        expect(hookArgs.path).toBe('/site/digitall');
        expect(hookArgs.workspace).toBe('EDIT');
    });

    it('should not display the badge when content is visible', () => {
        document.documentElement.innerHTML = html.toString();
        const cmp = shallowWithTheme(
            <ContentPreviewMemoWrapper/>,
            {},
            dsGenericTheme
        )
            .dive();

        const PreviewComponent = cmp.find({workspace: 'EDIT'});

        PreviewComponent.props().domLoadedCallback(document);
        expect(cmp.find('DsBadge').exists()).toBe(false);
    });

    it('should display the badge when content is not visible', () => {
        document.documentElement.innerHTML = '';
        const cmp = shallowWithTheme(
            <ContentPreviewMemoWrapper/>,
            {},
            dsGenericTheme
        )
            .dive();

        const PreviewComponent = cmp.find({workspace: 'EDIT'});

        PreviewComponent.props().domLoadedCallback(document);
        expect(cmp.find('DsBadge').exists()).toBe(true);
    });
});
