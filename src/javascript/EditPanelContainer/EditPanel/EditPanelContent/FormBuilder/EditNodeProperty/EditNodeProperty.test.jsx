import React from 'react';
import {shallow} from '@jahia/test-framework';

import {EditNodeProperty} from './EditNodeProperty';
import {ContentPicker} from '../SelectorTypes/Picker/ContentPicker/ContentPicker';
import {resolveSelectorType} from '../SelectorTypes/SelectorTypes.utils';

describe('EditNodeProperty component', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            classes: {},
            siteInfo: {languages: []},
            field: {
                formDefinition: {
                    name: 'text',
                    displayName: 'displayName',
                    nodeType: {
                        properties: [
                            {
                                name: 'text',
                                displayName: 'Text'
                            }
                        ]
                    },
                    readOnly: false,
                    selectorType: 'DatePicker',
                    selectorOptions: []
                },
                jcrDefinition: {},
                data: {
                    name: 'text'
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
                    displayName: 'text',
                    readOnly: false,
                    selectorOptions: [],
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
                jcrDefinition: {},
                data: {
                    name: 'text'
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
        expect(cmp.debug()).toContain('id="text"');
    });

    it('should display the field component resolved by selector type', () => {
        defaultProps.selectorType = resolveSelectorType({selectorType: 'Picker'});

        const cmp = shallow(
            <EditNodeProperty {...defaultProps}/>
        );

        const fieldComponent = cmp.find(ContentPicker);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
    });

    it('should display the contextualMenu when action exists', () => {
        let setActionContextFn;

        const Component = ({setActionContext}) => {
            setActionContextFn = setActionContext;
            return null;
        };

        defaultProps.selectorType = {
            cmp: Component
        };

        const cmp = shallow(
            <EditNodeProperty {...defaultProps}/>
        );

        cmp.find('Component').dive();
        setActionContextFn(() => ({noAction: false, contextHasChange: true}));

        expect(cmp.debug()).toContain('ContextualMenu');
    });

    it('should not display the contextualMenu when action does not exist', () => {
        const cmp = shallow(
            <EditNodeProperty {...defaultProps}/>
        );

        expect(cmp.debug()).not.toContain('ContextualMenu');
    });
});
