import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelLanguageSwitcher} from './';

describe('EditPanelLanguageSwitcher', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            lang: 'en',
            siteInfo: {
                languages: [
                    {
                        language: 'en',
                        displayName: 'English'
                    }
                ]
            },
            onSelectLanguage: jest.fn(),
            formik: jest.fn()
        };
    });

    // TODO
    it('should show languageSwitcher', () => {
        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        console.log(cmp.debug());
    });
});
