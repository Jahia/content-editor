import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {LeftPanel} from './LeftPanel';

describe('PickerDialog - LeftPanel', () => {
    let props;
    beforeEach(() => {
        props = {
            field: {
                selectorOptions: [{
                    name: 'A',
                    value: 'site'
                }]
            },
            site: 'digitall',
            siteNodes: [],
            lang: 'fr',
            nodeTreeConfigs: [{}],
            onSelectSite: jest.fn(),
            selectedPath: '/selectedPath',
            setSelectedPath: jest.fn(),
            setSelectedItem: jest.fn()
        };
    });

    it('should display the site switcher dropdown when the picker is not of type "site picker"', () => {
        props.field.selectorOptions = [];
        const cmp = shallowWithTheme(
            <LeftPanel {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('#site-switcher').exists()).toBe(true);
    });

    it('should hide the site switcher dropdown when the picker is of type "site picker"', () => {
        const cmp = shallowWithTheme(
            <LeftPanel {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('#site-switcher').exists()).toBe(false);
    });
});
