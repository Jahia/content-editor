import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {HeaderLowerSection} from './';
import {useContentEditorContext} from '~/ContentEditor.context';

jest.mock('~/ContentEditor.context');
describe('Header LowerSection', () => {
    let defaultProps;
    let contentEditorContext;

    beforeEach(() => {
        contentEditorContext = {
            mode: 'create',
            i18nContext: {},
            nodeData: {
                primaryNodeType: {
                    displayName: 'WIP-WOP'
                }
            },
            siteInfo: {
                languages: [{name: 'en', displayName: 'english'}]
            }
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);

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

    it('should not have edit tab items on create', () => {
        const cmp = shallowWithTheme(
            <HeaderLowerSection {...defaultProps}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find("Tab").exists()).toBeFalsy();
    });

    it('should have edit Tab Items on edit mode', () => {
        contentEditorContext.mode = 'edit';
        const cmp = shallowWithTheme(
            <HeaderLowerSection {...defaultProps}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find("Tab").exists()).toBeTruthy();
    });
});
