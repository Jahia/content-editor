import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {PreviewContainer} from './PreviewContainer';

jest.mock('../../../../ContentEditor.context', () => ({
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
            t: jest.fn(),
            classes: {},
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
            .dive()
            .dive();

        cmp.find('ContentPreview').exists();
    });

    it('should not selecte any tab in create mode', () => {
        defaultProps.mode = 'create';
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme)
            .dive()
            .dive();

        expect(cmp.find('WithStyles(ToggleButtonGroup)').props().value).toBe(null);
    });

    it('should select preview tab by default', () => {
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme)
            .dive()
            .dive();
        expect(cmp.find('WithStyles(ToggleButtonGroup)').props().value).toBe(
            'preview'
        );
    });

    it('should render preview by default', () => {
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme)
            .dive()
            .dive();
        expect(cmp.find('ContentPreviewMemoWrapper').exists()).toBe(true);
    });

    it('should still display preview when clicking on preview button', () => {
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme)
            .dive()
            .dive();
        cmp
            .find('WithStyles(ToggleButtonGroup)')
            .props()
            .onChange(null, null);
        expect(cmp.find('ContentPreviewMemoWrapper').exists()).toBe(true);
    });

    it('should render detailsPreview and selcted good tab when clicking on details button', () => {
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme)
            .dive()
            .dive();

        cmp
            .find('WithStyles(ToggleButtonGroup)')
            .props()
            .onChange(null, 'details');

        expect(cmp.find('WithStyles(ToggleButtonGroup)').props().value)
            .toBe('details');
        expect(cmp.find('Details').exists()).toBe(true);
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
            .dive()
            .dive();

        expect(cmp.find('DsBadge').exists()).toBe(false);
    });
});
