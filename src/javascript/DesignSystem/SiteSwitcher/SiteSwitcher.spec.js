import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import SiteSwitcher from './SiteSwitcher';

describe('SiteSwitcher', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            id: 'site-switcher',
            siteKey: 'digitall',
            siteNodes: [
                {
                    name: 'digitall',
                    displayName: 'Digitall',
                    uuid: '1234'
                },
                {
                    name: 'systemsite',
                    displayName: 'System site',
                    uuid: '4567'
                }
            ],
            onSelectSite: jest.fn()
        };
    });

    it('should give the siteKey props to SiteSwitcher component', () => {
        const cmp = shallowWithTheme(
            <SiteSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.props().value).toBe(defaultProps.siteKey);
    });

    it('should give the siteNodes props to SiteSwitcher component', () => {
        const cmp = shallowWithTheme(
            <SiteSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.props().data).toEqual([{
            label: 'Digitall',
            value: 'digitall'
        },
        {
            label: 'System site',
            value: 'systemsite'
        }]
        );
    });
});
