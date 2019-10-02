import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import {SingleSelectCmp} from './SingleSelect';

describe('SingleSelect component', () => {
    let props;

    beforeEach(() => {
        props = {
            classes: {
                selectField: ''
            },
            id: 'choiceList1',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                valueConstraints: [{
                    displayValue: 'yoloooFR',
                    value: {
                        string: 'Yolooo'
                    }
                }],
                selectorType: 'ChoiceList',
                readOnly: false
            },
            setActionContext: jest.fn()
        };
    });

    const handleChange = jest.fn();
    const handleFieldTouched = jest.fn();

    const buildComp = (componentProps, value) => {
        const mainComponent = shallowWithTheme(<SingleSelectCmp {...componentProps}/>, {}, dsGenericTheme);
        const RenderProps = mainComponent.props().render;
        const val = value ? {value: value} : {};
        return shallowWithTheme(<RenderProps field={{val, onChange: handleChange}} form={{setFieldTouched: handleFieldTouched}}/>, {}, dsGenericTheme);
    };

    it('should bind id correctly', () => {
        const cmp = buildComp(props, 'Yolooo');
        expect(cmp.props().inputProps.id).toBe(props.id);
    });

    it('should display each option given', () => {
        const cmp = buildComp(props, 'Yolooo');
        props.field.valueConstraints.forEach(constraint => {
            expect(cmp.debug()).toContain(constraint.displayValue);
        });
    });

    it('should replace null value as empty string', () => {
        const cmp = buildComp(props);
        expect(cmp.props().value).toBe('');
    });

    it('should select formik value', () => {
        const cmp = buildComp(props);
        cmp.simulate('change', 'Yolooo');
        expect(handleChange).toHaveBeenCalledWith('Yolooo');
        expect(handleFieldTouched).toHaveBeenCalledWith('myOption', true);
    });

    it('should set readOnly to true when fromdefinition is readOnly', () => {
        testReadOnly(true);
    });

    it('should set readOnly to false when fromdefinition is not readOnly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = buildComp(props, 'Yolooo');
        const inputCmp = shallowWithTheme(cmp.props().input, {}, dsGenericTheme);

        expect(inputCmp.props().readOnly).toEqual(readOnly);
    };
});
