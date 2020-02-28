import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelLanguageSwitcher} from './';

jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorConfigContext: () => ({
            lang: 'fr'
        })
    };
});

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
            formik: {}
        };
    });

    it('should show language switcher', () => {
        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('LanguageSwitcher').exists()).toBe(true);
    });

    it('should contains dialog confirmation', () => {
        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('EditPanelDialogConfirmation').exists()).toBe(true);
    });
});
