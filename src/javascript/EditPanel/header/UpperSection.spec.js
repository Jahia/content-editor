import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {HeaderUpperSection} from './';
import {Constants} from '~/ContentEditor.constants';

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
                formik: {
                    values: {
                        'WIP::Info': {
                            status: Constants.wip.status.DISABLED
                        }
                    }
                },
                mode: 'create'
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

    it('should u and unsaved info chip displayed when ce in create mode', () => {
        const cmp = shallowWithTheme(
            <HeaderUpperSection {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find({'data-sel-role': 'unsaved-info-chip'}).exists()).toBe(true);
    });
});
