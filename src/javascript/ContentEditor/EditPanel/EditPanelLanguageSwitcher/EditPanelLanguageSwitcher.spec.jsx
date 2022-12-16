import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelLanguageSwitcher} from './index';

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => ({
            i18nContext: {},
            setI18nContext: jest.fn(),
            resetI18nContext: jest.fn(),
            siteInfo: {
                languages: [
                    {
                        language: 'en',
                        displayName: 'English'
                    }
                ]
            }
        })
    };
});
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context', () => {
    return {
        useContentEditorConfigContext: () => ({
            lang: 'fr'
        })
    };
});

describe('EditPanelLanguageSwitcher', () => {
    let defaultProps;
    it('should NOT show language switcher with one language', () => {
        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('Dropdown').exists()).toBeFalsy();
    });

    it('should show language switcher with more than one language', () => {
        defaultProps.siteInfo.languages.push({
            language: 'fr',
            displayName: 'French'
        });

        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('Dropdown').exists()).toBe(true);
    });
});
