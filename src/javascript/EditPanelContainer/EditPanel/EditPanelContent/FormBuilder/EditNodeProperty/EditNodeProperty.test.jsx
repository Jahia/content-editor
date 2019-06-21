import React from 'react';
import {shallow} from '@jahia/test-framework';

import {EditNodeProperty} from './EditNodeProperty';
import SelectorTypes from '../SelectorTypes/SelectorTypes';
import {ContentPicker} from '../SelectorTypes/Picker/ContentPicker/ContentPicker';

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
            editorContext: {},
            fieldComponentKey: 'fieldComponentKeyForSelenium',
            labelHtmlFor: 'yoloHtmlFor',
            selectorType: {
                cmp: () => <div>test</div>,
                key: 'test'
            },
            formik: {},
            t: i18nKey => i18nKey,
            dxContext: {}
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
                <EditNodeProperty {...defaultProps}/>
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

    it('should add labelHtmlFor to the label and the field should have a defined id attribute', () => {
        const cmp = shallow(
            <EditNodeProperty {...defaultProps}/>
        );

        expect(cmp.debug()).toContain('yoloHtmlFor');
        expect(cmp.debug()).toContain('id=\"text\"');
    });

    it('should display the field component resolved by selector type', () => {
        defaultProps.selectorType = SelectorTypes.resolveSelectorType('Picker');

        const cmp = shallow(
            <EditNodeProperty {...defaultProps}/>
        );

        const fieldComponent = cmp.find(ContentPicker);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
    });
});
