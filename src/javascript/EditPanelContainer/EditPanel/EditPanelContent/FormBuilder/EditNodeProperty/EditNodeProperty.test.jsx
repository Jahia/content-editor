import React from 'react';
import {shallow} from '@jahia/test-framework';

import {EditNodeProperty} from './EditNodeProperty';

describe('EditNodeProperty component', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            classes: {},
            siteInfo: {languages: []},
            field: {
                formDefinition: {
                    name: 'text',
                    nodeType: {
                        properties: [
                            {
                                name: 'text',
                                displayName: 'Text'
                            }
                        ]
                    }
                },
                targets: [{name: 'test'}]
            },
            labelHtmlFor: 'yoloHtmlFor',
            t: i18nKey => i18nKey
        };
    });

    it('should render a "Shared in all languages" when field is not i18n and site have multiple languages', () => {
        let lang1 = {
            displayName: 'Deutsch',
            language: 'de',
            activeInEdit: true
        };
        let lang2 = {
            displayName: 'English',
            language: 'en',
            activeInEdit: true
        };

        const testI18nBadgeRender = (
            i18n,
            siteLanguages,
            expectedBadgeRendered
        ) => {
            defaultProps.field = {
                formDefinition: {
                    name: 'text',
                    nodeType: {
                        properties: [
                            {
                                name: 'text',
                                displayName: 'Text'
                            }
                        ]
                    },
                    selectorType: 'Text',
                    i18n: i18n
                },
                targets: [{name: 'test'}]
            };
            defaultProps.siteInfo = {
                languages: siteLanguages
            };

            const cmp = shallow(
                <EditNodeProperty {...defaultProps}>
                    <div>test</div>
                </EditNodeProperty>
            );

            const badgeComponent = cmp.find({
                badgeContent:
                    'content-editor:label.contentEditor.edit.sharedLanguages'
            });
            expect(badgeComponent.exists()).toBe(expectedBadgeRendered);
        };

        testI18nBadgeRender(false, [lang1, lang2], true);
        testI18nBadgeRender(true, [lang1, lang2], false);
        testI18nBadgeRender(false, [lang1], false);
        testI18nBadgeRender(true, [lang1], false);
    });

    it('should add labelHtmlFor to the label', () => {
        const cmp = shallow(
            <EditNodeProperty {...defaultProps}>
                <div>test</div>
            </EditNodeProperty>
        );

        expect(cmp.debug()).toContain('yoloHtmlFor');
    });
});
