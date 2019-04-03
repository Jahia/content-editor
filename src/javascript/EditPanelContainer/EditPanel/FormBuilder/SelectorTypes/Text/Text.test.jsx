import React from 'react';
import {shallow} from '@jahia/test-framework';
import {Input} from '@material-ui/core';

import {Text} from './Text';

describe('Text component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
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
        wrapper = shallow(<Text {...props}/>);
    });

    it('should contain one TextField component', () => {
        expect(wrapper.find(Input).length).toBe(1);
    });

    it('should contain a matching TextField component', () => {
        const fieldName = props.field.formDefinition.name;
        const expectedMatch = <Input id={fieldName} name={fieldName}/>;

        expect(wrapper.containsMatchingElement(expectedMatch)).toBe(true);
    });

    it('should obtain its initial value from formik.values', () => {
        const fieldName = props.field.formDefinition.name;
        const fieldValue = 'some dummy value';

        props.formik.values[fieldName] = fieldValue;

        expect(wrapper.setProps(props)
            .find(Input)
            .prop('value')
        ).toEqual(fieldValue);
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

        expect(wrapper.setProps(props)
            .find(Input)
            .prop('readOnly')
        ).toEqual(readOnly);
    };
});
