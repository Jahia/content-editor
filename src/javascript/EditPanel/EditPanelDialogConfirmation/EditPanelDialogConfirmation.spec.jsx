import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelDialogConfirmation} from './';
import {useFormikContext} from "formik";

jest.mock('formik');

describe('EditPanelDialogConfirmation', () => {
    let defaultProps;
    let formik;

    beforeEach(() => {
        defaultProps = {
            isOpen: false,
            titleKey: 'titleKey',
            t: jest.fn(key => 'translated_' + key),
            onCloseDialog: jest.fn(),
            actionCallback: jest.fn(),
        };
        formik = {};
        useFormikContext.mockReturnValue(formik);
    });

    it('should hide dialog confirmation when open is false', () => {
        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(false);
    });

    it('should contain translated titleKey', () => {
        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('translated_' + defaultProps.titleKey);
    });

    it('should show dialog confirmation when open is true', () => {
        defaultProps.isOpen = true;

        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(true);
    });

    it('should not disable the save changes button when there are no validation errors', () => {
        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
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
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('SaveButton').dive().props().isDisabled).toBe(true);
    });
});
