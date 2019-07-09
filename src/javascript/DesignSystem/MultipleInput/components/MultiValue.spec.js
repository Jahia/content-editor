import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {MultiValue} from './MultiValue';

describe('MultiValue', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            className: 'yo',
            innerRef: {},
            data: {
                label: 'zertyu'
            },
            removeProps: {
                onClick: jest.fn()
            }
        };
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <MultiValue {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });

    it('should display icon when field is not disabled', () => {
        const cmp = shallowWithTheme(
            <MultiValue {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().onDelete).toBeTruthy();
    });

    it('should not display icon when field is disabled', () => {
        defaultProps.isDisabled = true;
        const cmp = shallowWithTheme(
            <MultiValue {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().onDelete).not.toBeTruthy();
    });
});
