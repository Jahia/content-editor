import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Input} from '../../../../../../DesignSystem/Input';

import {Text} from './Text';

describe('Text component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            id: 'toto',
            editorContext: {
                uiLang: 'en'
            },
            field: {
                formDefinition: {
                    name: 'x',
                    readOnly: false,
                    selectorType: 'Text'
                },
                jcrDefinition: {
                    requiredType: 'STRING'
                },
                data: {
                    name: 'x'
                },
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
        wrapper = shallowWithTheme(<Text {...props}/>, {}, dsGenericTheme);
    });

    it('should contain one Input component', () => {
        expect(wrapper.find(Input).length).toBe(1);
    });

    it('should contain a matching Input props values', () => {
        expect(wrapper.props().id).toBe(props.id);
        expect(wrapper.props().name).toBe(props.field.formDefinition.name);
    });

    it('should obtain its initial value from formik.values', () => {
        const fieldName = props.field.formDefinition.name;
        const fieldValue = 'some dummy value';

        props.formik.values[fieldName] = fieldValue;
        wrapper.setProps(props);
        expect(wrapper.props().defaultValue).toBe(fieldValue);
    });

    it('should call formik.handleChange on change', () => {
        props.formik.handleChange = jest.fn();

        wrapper.setProps(props)
            .find(Input)
            .simulate('change');

        expect(props.formik.handleChange.mock.calls.length).toBe(1);
    });

    it('should call formik.handleBlur on blur', () => {
        props.formik.handleBlur = jest.fn();

        wrapper.setProps(props)
            .find(Input)
            .simulate('blur');

        expect(props.formik.handleBlur.mock.calls.length).toBe(1);
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    let testReadOnly = function (readOnly) {
        props.field.formDefinition.readOnly = readOnly;
        wrapper.setProps(props);
        expect(wrapper.props().readOnly).toBe(readOnly);
    };

    it('should be the input of type number in case of long, decimal or double', () => {
        props.field.jcrDefinition.requiredType = 'DOUBLE';
        wrapper.setProps(props);

        expect(wrapper.props().type).toBe('number');
    });

    it('should be the input of type text', () => {
        expect(wrapper.props().type).toBe('text');
    });

    it('should input of type number have decimal scale equals 0 if it is long', () => {
        props.field.jcrDefinition.requiredType = 'LONG';
        wrapper.setProps(props);

        expect(wrapper.props().decimalScale).toBe(0);
    });

    it('should input of type number have decimal scale undefined if it is double', () => {
        props.field.jcrDefinition.requiredType = 'DOUBLE';
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
