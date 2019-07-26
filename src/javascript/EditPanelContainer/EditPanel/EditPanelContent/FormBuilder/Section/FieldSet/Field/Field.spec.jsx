import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {Field} from './Field';
import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from './SelectorTypes/Text/Text';

describe('Field component', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            classes: {},
            siteInfo: {languages: []},
            field: {
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
            editorContext: {},
            fieldComponentKey: 'fieldComponentKeyForSelenium',
            labelHtmlFor: 'yoloHtmlFor',
            selectorType: {
                cmp: () => <div>test</div>,
                key: 'test'
            },
            formik: {},
            t: i18nKey => i18nKey,
            dxContext: {},
            actionContext: {}
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
            };
            defaultProps.siteInfo = {
                languages: siteLanguages
            };

            const cmp = shallowWithTheme(
                <Field {...defaultProps}><div>test</div></Field>,
                {},
                dsGenericTheme
            )
                .dive()
                .dive();

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
        defaultProps.input = <Text/>;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('yoloHtmlFor');
        // Todo: BACKLOG-10755 fix test on id (move it to Field,container if necessary
        // expect(cmp.dive().dive().debug()).toContain('id="text"');
    });
    // Todo: BACKLOG-10753 fix it !
    /* it('should display the contextualMenu when action exists', () => {
        let setActionContextFn;

        const Component = ({setActionContext}) => {
            setActionContextFn = setActionContext;
            return null;
        };

        defaultProps.selectorType = {
            cmp: Component
        };

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        cmp.dive().dive().find('Component').dive();
        setActionContextFn(() => ({noAction: false, contextHasChange: true}));

        expect(cmp.debug()).toContain('ContextualMenu');
    });

    it('should not display the contextualMenu when action does not exist', () => {
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).not.toContain('ContextualMenu');
    }); */
});
