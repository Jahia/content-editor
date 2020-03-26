import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {HeaderLowerSection} from './';

describe('Header LowerSection', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            actionContext: {
                siteInfo: {},
                language: 'fr'
            },
            setActiveTab: jest.fn(),
            activeTab: 'advanced tab'
        };
    });

    it('should not throw error', () => {
        shallowWithTheme(
            <HeaderLowerSection {...defaultProps}/>,
            {},
            dsGenericTheme
        );
    });
});
