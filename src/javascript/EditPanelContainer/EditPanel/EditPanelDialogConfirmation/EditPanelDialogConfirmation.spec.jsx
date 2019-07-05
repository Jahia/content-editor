import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelDialogConfirmation} from './';

describe('EditPanelDialogConfirmation', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            open: false,
            allowDiscard: false,
            t: jest.fn(),
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

    it('should show dialog confirmation when open is true', () => {
        defaultProps.open = true;

        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(true);
    });

    it('should display cancel and save buttons in dialog confirmation when it is not allowed to discard', () => {
        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(Button)').length).toBe(2);
    });

    it('should display cancel, discard and save buttons in dialog confirmation when it is allowed to discard', () => {
        defaultProps.allowDiscard = true;

        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(Button)').length).toBe(3);
    });
});
