import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {Field} from './Field';
import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from '~/SelectorTypes/Text/Text';
import {registry} from '@jahia/ui-extender';

jest.mock('~/EditPanel/WorkInProgress/WorkInProgress.utils', () => {
    return {
        showChipField: jest.fn()
    };
});

let mockEditorContext;
jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => (mockEditorContext)
    };
});

jest.mock('@apollo/react-hooks', () => {
    let responsemock;
    return {
        useApolloClient: () => responsemock,
        setResponseMock: m => {
            responsemock = m;
        }
    };
});

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

import {setResponseMock} from '@apollo/react-hooks';

describe('Field component', () => {
    let defaultProps;
    let result;

    beforeEach(() => {
        mockEditorContext = {
            registerRefreshField: () => {},
            lang: 'en',
            siteInfo: {
                languages: ['en']
            },
            nodeData: {
                uuid: '1234-1234-1234-1234',
                parent: {
                    path: '/parent-path'
                },
                primaryNodeType: {
                    name: 'thePrimaryNodeType'
                }
            }
        };
        defaultProps = {
            classes: {},
            field: {
                name: 'text',
                description: 'This is a description for this text field.',
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
            fieldComponentKey: 'fieldComponentKeyForSelenium',
            labelHtmlFor: 'yoloHtmlFor',
            selectorType: {
                cmp: () => <div>test</div>,
                key: 'DatePicker'
            },
            formik: {
                errors: {},
                touched: {},
                values: {},
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn()
            },
            t: i18nKey => i18nKey,
            actionContext: {},
            input: <></>,
            inputContext: {
                displayBadges: true,
                displayActions: true,
                displayLabels: true,
                displayErrors: true
            },
            idInput: 'FieldID'
        };

        result = {data: {forms: {fieldConstraints: []}}};
        setResponseMock(result);
    });

    it('should call onChange from registry', () => {
        let result = [];
        const onChangePreviousValue = 'previousValue';
        const onChangeCurrentValue = 'currentValue';

        // Register onChange for DatePicker
        const datePickerOnChange = {
            targets: ['DatePicker'],
            onChange: (previousValue, currentValue) => {
                result = [previousValue, currentValue];
            }
        };
        registry.add('selectorType.onChange', 'callBacks', datePickerOnChange);

        // Build component
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;
        defaultProps.formik.values.text = onChangePreviousValue;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        // Should init call the onChange
        cmp.debug();
        expect(result[0]).toBe(undefined);
        expect(result[1]).toBe(onChangePreviousValue);
        expect(defaultProps.formik.setFieldValue).not.toHaveBeenCalled();
        expect(defaultProps.formik.setFieldTouched).not.toHaveBeenCalled();

        // Trigger field update
        cmp.find('SingleField').props().onChange(onChangeCurrentValue);
        expect(result[0]).toBe(onChangePreviousValue);
        expect(result[1]).toBe(onChangeCurrentValue);
        expect(defaultProps.formik.setFieldValue).toHaveBeenCalledWith('text', onChangeCurrentValue, true);
        expect(defaultProps.formik.setFieldTouched).toHaveBeenCalledWith('text', true, false);
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
            mockEditorContext.siteInfo = {
                languages: siteLanguages
            };

            const cmp = shallowWithTheme(
                <Field {...defaultProps}><div>test</div></Field>,
                {},
                dsGenericTheme
            )
                .dive();

            const badgeComponent = cmp.find({
                badgeContent:
                    'translated_content-editor:label.contentEditor.edit.sharedLanguages'
            });
            expect(badgeComponent.exists()).toBe(expectedBadgeRendered);
        };

        testI18nBadgeRender(false, [lang1, lang2], true);
        testI18nBadgeRender(true, [lang1, lang2], false);
        testI18nBadgeRender(false, [lang1], false);
        testI18nBadgeRender(true, [lang1], false);
    });

    it('should add htmlFor to the label', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).toContain('htmlFor="FieldID"');
    });

    it('should display the description label when field has a description', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).toContain('This is a description for this text field.');
    });

    it('should not display the description label when field has not a description', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;

        defaultProps.field.description = '';
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).not.toContain('This is a description for this text field.');
    });

    it('should not add htmlFor to the label when field is multiple', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = true;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).not.toContain('htmlFor="FieldID"');
    });

    it('should display an error message when field is in error', () => {
        defaultProps.formik.errors = {
            text: 'required'
        };

        defaultProps.formik.touched = {
            text: true
        };

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().debug()).toContain('errors.required');
    });
});
