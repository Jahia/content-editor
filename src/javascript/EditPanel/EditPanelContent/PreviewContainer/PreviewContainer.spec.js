import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {PreviewContainer} from './PreviewContainer';

jest.mock('~/ContentEditor.context', () => ({
    useContentEditorContext: () => ({
        path: '/site/digitall',
        lang: 'fr'
    })
}));

describe('PreviewContainer', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            editorContext: {
                path: '',
                language: 'en',
                lang: 'fr'
            },
            isDirty: false,
            mode: 'edit'
        };
    });

    it('should display content preview', () => {
        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        cmp.find('ContentPreview').exists();
    });

    it('should render preview when the component is used', () => {
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme)
            .dive();
        expect(cmp.find('ContentPreviewMemoWrapper').exists()).toBe(true);
    });

    it('should display the badge preview update on save when content is updated', () => {
        defaultProps.isDirty = true;

        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.find('DsBadge').exists()).toBe(true);
    });

    it('should hide the badge preview update on save when content is not updated', () => {
        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.find('DsBadge').exists()).toBe(false);
    });
});
