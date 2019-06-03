import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {Input} from '../../../../../../DesignSystem/Input';

import {Text} from './Text';

describe('Text component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            id: 'toto',
            field: {
                formDefinition: {
                    name: 'x'
                },
                targets: [{name: 'test'}]
            },
            formik: {
                handleBlur: () => {},
                handleChange: () => {},
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
});
