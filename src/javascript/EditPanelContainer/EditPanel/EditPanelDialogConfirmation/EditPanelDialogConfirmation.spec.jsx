import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelDialogConfirmation} from './';

describe('EditPanelDialogConfirmation', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            open: false,
            titleKey: 'titleKey',
            t: jest.fn(key => 'translated_' + key),
            onCloseDialog: jest.fn(),
            actionCallback: jest.fn(),
            formik: {}
        };
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
        defaultProps.open = true;

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

        expect(cmp.find('DsButton').at(2).props().disabled).toBe(false);
    });

    it('should disable the save changes button when there are validation errors', () => {
        defaultProps.formik.errors = {
            field1: 'required',
            field2: 'required'
        };

        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('DsButton').at(2).props().disabled).toBe(true);
    });
});
