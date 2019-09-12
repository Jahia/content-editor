import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {TextCmp} from './Text';

describe('Text component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            id: 'toto[1]',
            editorContext: {
                uiLang: 'en'
            },
            field: {
                name: 'toto',
                displayName: 'toto',
                readOnly: false,
                selectorType: 'Text',
                requiredType: 'STRING',
                targets: [{name: 'test'}]
            },
            formik: {
                handleBlur: () => {
                },
                handleChange: () => {
                },
                values: []
            }
        };
        wrapper = shallowWithTheme(<TextCmp {...props}/>, {}, dsGenericTheme);
    });

    it('should contain aria-labelledby attribute', () => {
        expect(wrapper.props().inputProps['aria-labelledby']).toBe('toto-label');
    });

    it('should contain one Input component', () => {
        expect(wrapper.find('Input').length).toBe(1);
    });

    it('should contain a matching Input props values', () => {
        expect(wrapper.props().id).toBe(props.id);
        expect(wrapper.props().name).toBe(props.id);
    });

    it('should obtain its initial value from value param', () => {
        const fieldValue = 'some dummy value';

        props.value = fieldValue;
        wrapper.setProps(props);
        expect(wrapper.props().value).toBe(fieldValue);
    });

    it('should call formik.handleChange on change', () => {
        props.formik.handleChange = jest.fn();

        wrapper.setProps(props)
            .find('Input')
            .simulate('change');

        expect(props.formik.handleChange.mock.calls.length).toBe(1);
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        wrapper.setProps(props);
        expect(wrapper.props().readOnly).toBe(readOnly);
    };

    it('should be the input of type number in case of long, decimal or double', () => {
        props.field.requiredType = 'DOUBLE';
        wrapper.setProps(props);

        expect(wrapper.props().type).toBe('number');
    });

    it('should be the input of type text', () => {
        expect(wrapper.props().type).toBe('text');
    });

    it('should input of type number have decimal scale equals 0 if it is long', () => {
        props.field.requiredType = 'LONG';
        wrapper.setProps(props);

        expect(wrapper.props().decimalScale).toBe(0);
    });

    it('should input of type number have decimal scale undefined if it is double', () => {
        props.field.requiredType = 'DOUBLE';
        wrapper.setProps(props);

        expect(wrapper.props().decimalScale).toBe(undefined);
    });

    it('should input of type number use point as decimal separator when language is "en"', () => {
        props.editorContext.uiLang = 'en';
        wrapper.setProps(props);

        expect(wrapper.props().decimalSeparator).toBe('.');
    });

    it('should input of type number use comma as decimal separator when language is "fr"', () => {
        props.editorContext.uiLang = 'fr';
        wrapper.setProps(props);

        expect(wrapper.props().decimalSeparator).toBe(',');
    });
});
