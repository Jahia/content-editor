import React, {useEffect} from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Preview} from './Preview';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import {useFormikContext} from 'formik';

jest.mock('formik');
jest.mock('~/contexts/ContentEditor/ContentEditor.context');
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context');
jest.mock('~/contexts/ContentEditorSection/ContentEditorSection.context');

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: jest.fn()
    };
});

jest.useFakeTimers();

describe('Preview Container', () => {
    let defaultProps;
    let formik;
    let editorContext;

    beforeEach(() => {
        formik = {
            dirty: false
        };
        defaultProps = {
        };
        editorContext = {
            path: '/site/digitall',
            lang: 'fr',
            nodeData: {
                isFolder: false
            }
        };
        useEffect.mockReset();
        useContentEditorContext.mockReturnValue(editorContext);
        useContentEditorConfigContext.mockReturnValue({});

        useFormikContext.mockReturnValue(formik);
    });

    it('should not display preview on first render', () => {
        const cmp = shallowWithTheme(<Preview {...defaultProps}/>, {}, dsGenericTheme);
        expect(cmp.find('Memo()').exists()).toBe(false);
        expect(cmp.find('LoaderOverlay').exists()).toBe(true);
    });

    it('should not display preview on folder', () => {
        editorContext.nodeData.isFolder = true;
        const cmp = shallowWithTheme(<Preview {...defaultProps}/>, {}, dsGenericTheme);
        useEffect.mock.calls[0][0]();
        jest.runAllTimers();
        cmp.setProps();
        expect(cmp.find('Memo()').exists()).toBe(false);
        expect(cmp.find('LoaderOverlay').exists()).toBe(false);
    });

    it('should display preview after a timeout', () => {
        const cmp = shallowWithTheme(<Preview {...defaultProps}/>, {}, dsGenericTheme);
        useEffect.mock.calls[0][0]();
        jest.runAllTimers();
        cmp.setProps();
        expect(cmp.find('Memo()').exists()).toBe(true);
        expect(cmp.find('LoaderOverlay').exists()).toBe(false);
    });

    it('should display the badge preview update on save when content is updated', () => {
        formik.dirty = true;

        const cmp = shallowWithTheme(
            <Preview {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('UpdateOnSaveBadge').dive().find('DsBadge').exists()).toBe(true);
    });

    it('should hide the badge preview update on save when content is not updated', () => {
        const cmp = shallowWithTheme(
            <Preview {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('DsBadge').exists()).toBe(false);
    });

    it('should show a badge for no preview for folder', () => {
        editorContext.nodeData.isFolder = true;
        const cmp = shallowWithTheme(
            <Preview {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('DsBadge').exists()).toBe(true);
    });

    it('should show a badge when cannot find content to display ', () => {
        const cmp = shallowWithTheme(
            <Preview {...defaultProps}/>,
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
