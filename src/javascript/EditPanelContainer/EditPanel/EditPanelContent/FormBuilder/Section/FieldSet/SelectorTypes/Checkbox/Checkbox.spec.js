import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import Checkbox from './Checkbox';

jest.mock('formik', () => {
    let formikpropsmock;

    return {
        setFormikProps: props => {
            formikpropsmock = props;
        },
        connect: Cmp => props => (
            <Cmp {...props} formik={formikpropsmock}/>
        )
    };
});

import {setFormikProps} from 'formik';

describe('Checkbox component', () => {
    let props;
    let formikProps;

    beforeEach(() => {
        props = {
            id: 'checkbox1',
            field: {
                jcrDefinition: {},
                targets: [],
                data: {name: 'x'},
                formDefinition: {
                    name: 'myCheckbox',
                    readOnly: false,
                    selectorType: 'ContentPicker'
                }
            },
            classes: {}
        };

        formikProps = {
            values: {
                myCheckbox: false
            },
            setFieldValue: jest.fn()
        };
    });

    it('should display unchecked', () => {
        setFormikProps(formikProps);

        const checkboxCmp = shallowWithTheme(<Checkbox {...props}/>, {}, dsGenericTheme);
        expect(checkboxCmp.dive().dive().props().checked).toBe(false);
    });

    it('should display checked', () => {
        formikProps.values.myCheckbox = true;
        setFormikProps(formikProps);
        const checkboxCmp = shallowWithTheme(<Checkbox {...props}/>, {}, dsGenericTheme);
        expect(checkboxCmp.dive().dive().props().checked).toBe(true);
    });

    it('should change', () => {
        setFormikProps(formikProps);
        const checkboxCmp = shallowWithTheme(<Checkbox {...props}/>, {}, dsGenericTheme);
        const innerCmp = checkboxCmp.dive().dive();
        innerCmp.simulate('change', null, true);
        expect(formikProps.setFieldValue).toHaveBeenCalledWith('myCheckbox', true);
    });

    it('should be readonly', () => {
        testReadOnly(true);
    });

    it('should not be readonly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.formDefinition.readOnly = readOnly;
        setFormikProps(formikProps);

        const checkboxCmp = shallowWithTheme(<Checkbox {...props}/>, {}, dsGenericTheme);
        expect(checkboxCmp.dive().dive().props().readOnly).toBe(readOnly);
    };
});
