import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {HeaderUpperSection} from './';

describe('Header UpperSection', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            actionContext: {
                nodeData: {
                    primaryNodeType: {
                        displayName: 'WIP-WOP'
                    }
                },
                mode: 'EDIT'
            },
            title: 'yolo'
        };
    });

    it('should show the title', () => {
        const cmp = shallowWithTheme(
            <HeaderUpperSection {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('yolo');
    });
});
