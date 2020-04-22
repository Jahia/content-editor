import React, {useEffect} from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {PreviewContainer} from './Preview.container';
import {useContentEditorContext} from '~/ContentEditor.context';

jest.mock('~/ContentEditor.context', () => ({
    useContentEditorContext: jest.fn()
}));

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: jest.fn()
    };
});

jest.useFakeTimers();

describe('Preview Container', () => {
    let defaultProps;
    let editorContext;

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
        editorContext = {
            path: '/site/digitall',
            lang: 'fr',
            nodeData: {
                isFolder: false
            }
        };
        useEffect.mockReset();
        useContentEditorContext.mockImplementation(() => editorContext);
    });

    it('should not display preview on first render', () => {
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme);
        expect(cmp.find('Memo()').exists()).toBe(false);
        expect(cmp.find('WithStyles(ProgressOverlayCmp)').exists()).toBe(true);
    });

    it('should not display preview on folder', () => {
        editorContext.nodeData.isFolder = true;
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme);
        useEffect.mock.calls[0][0]();
        jest.runAllTimers();
        cmp.setProps();
        expect(cmp.find('Memo()').exists()).toBe(false);
        expect(cmp.find('WithStyles(ProgressOverlayCmp)').exists()).toBe(false);
    });

    it('should display preview after a timeout', () => {
        const cmp = shallowWithTheme(<PreviewContainer {...defaultProps}/>, {}, dsGenericTheme);
        useEffect.mock.calls[0][0]();
        jest.runAllTimers();
        cmp.setProps();
        expect(cmp.find('Memo()').exists()).toBe(true);
        expect(cmp.find('WithStyles(ProgressOverlayCmp)').exists()).toBe(false);
    });

    it('should display the badge preview update on save when content is updated', () => {
        defaultProps.isDirty = true;

        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('DsBadge').exists()).toBe(true);
    });

    it('should hide the badge preview update on save when content is not updated', () => {
        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('DsBadge').exists()).toBe(false);
    });

    it('should show a badge for no preview for folder', () => {
        editorContext.nodeData.isFolder = true;
        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('DsBadge').exists()).toBe(true);
    });

    it('should show a badge when cannot find content to display ', () => {
        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        );
        useEffect.mock.calls[0][0]();
        jest.runAllTimers();
        cmp.setProps();
        cmp.find('Memo()').simulate('contentNotFound');
        expect(cmp.find('DsBadge').exists()).toBe(true);
    });
});
