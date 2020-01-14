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
        const cmp = shallowWithTheme(
            <ContentPreviewMemoWrapper/>,
            {},
            dsGenericTheme
        )
            .dive();
        const props = cmp.find('ContentPreview').props();
        expect(props.language).toBe('fr');
        expect(props.path).toBe('/site/digitall');
        expect(props.workspace).toBe('EDIT');
    });

    it('should not display the badge when content is visible', () => {
        document.documentElement.innerHTML = html.toString();
        const cmp = shallowWithTheme(
            <ContentPreviewMemoWrapper/>,
            {},
            dsGenericTheme
        )
            .dive();

        const RenderProps = cmp.find('ContentPreview').props().children;
        const children = shallowWithTheme(<RenderProps/>, {}, dsGenericTheme);

        children.props().domLoadedCallback(document);
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

        const RenderProps = cmp.find('ContentPreview').props().children;
        const children = shallowWithTheme(<RenderProps/>, {}, dsGenericTheme);

        children.props().domLoadedCallback(document);
        expect(cmp.find('DsBadge').exists()).toBe(true);
    });
});
