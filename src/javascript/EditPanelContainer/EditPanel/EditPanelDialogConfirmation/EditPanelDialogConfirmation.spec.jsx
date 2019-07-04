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
            formik: jest.fn()
        };
    });

    // TODO
    it('should show dialog confirmation', () => {
        const cmp = shallowWithTheme(
            <EditPanelDialogConfirmation {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        console.log(cmp.debug());
    });
});
