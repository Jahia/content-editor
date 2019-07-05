import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelLanguageSwitcher} from './';
import {createMockStore} from 'redux-test-utils';

describe('EditPanelLanguageSwitcher', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            siteInfo: {
                languages: [
                    {
                        language: 'en',
                        displayName: 'English'
                    }
                ]
            },
            onSelectLanguage: jest.fn(),
            formik: {},
            store: createMockStore({language: 'en'})
        };
    });

    it('should show language switcher', () => {
        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.find('LanguageSwitcher').length).toBe(1);
    });

    it('should contains dialog confirmation', () => {
        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.debug()).toContain('<Component open={false}');
    });
});
