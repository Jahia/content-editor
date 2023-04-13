import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {CloseConfirmationDialog} from './CloseConfirmationDialog';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';

jest.mock('formik');
jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => ({useContentEditorContext: jest.fn()}));

describe('CloseConfirmationDialog', () => {
    let defaultProps;
    let formik;

    beforeEach(() => {
        defaultProps = {
            isOpen: false,
            t: jest.fn(key => 'translated_' + key),
            onCloseDialog: jest.fn(),
            actionCallback: jest.fn()
        };
        formik = {};
        useFormikContext.mockReturnValue(formik);
        useContentEditorContext.mockImplementation(() => ({
            lang: 'en',
            siteInfo: {
                languages: [{
                    language: 'en', displayName: 'English'
                }]
            }
        }));
    });

    it('should hide dialog confirmation when open is false', () => {
        const cmp = shallowWithTheme(
            <CloseConfirmationDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(false);
    });

    it('should contain translated titleKey', () => {
        const cmp = shallowWithTheme(
            <CloseConfirmationDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('translated_');
    });

    it('should show dialog confirmation when open is true', () => {
        defaultProps.isOpen = true;

        const cmp = shallowWithTheme(
            <CloseConfirmationDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(true);
    });

    it('should not disable the save changes button when there are no validation errors', () => {
        const cmp = shallowWithTheme(
            <CloseConfirmationDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('SaveButton').dive().props().isDisabled).toBe(false);
    });

    it('should disable the save changes button when there are validation errors', () => {
        formik.errors = {
            field1: 'required',
            field2: 'required'
        };

        const cmp = shallowWithTheme(
            <CloseConfirmationDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('SaveButton').dive().props().isDisabled).toBe(true);
    });
});
