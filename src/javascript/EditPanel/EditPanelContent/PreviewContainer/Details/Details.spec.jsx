import {Details} from './index';
import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

describe('Details', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
        };
    });

    it('should not throw error', () => {
        shallowWithTheme(<Details {...defaultProps}/>, {}, dsGenericTheme);
    });
});
