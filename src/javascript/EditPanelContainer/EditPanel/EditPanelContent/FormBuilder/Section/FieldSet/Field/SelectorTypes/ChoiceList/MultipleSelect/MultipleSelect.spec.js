import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import MultipleSelect from './MultipleSelect';
import {dsGenericTheme} from '@jahia/design-system-kit';

describe('MultipleSelect component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'MultipleSelect1',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                valueConstraints: [{
                    displayValue: 'yoloooFR',
                    value: {
                        string: 'Yolooo'
                    }
                }, {
                    displayValue: 'yoloooFR2',
                    value: {
                        string: 'Yolooooooooo'
                    }
                }],
                selectorType: 'MultipleSelect',
                readOnly: false,
                multiple: true
            },
            setActionContext: jest.fn()
        };
    });

    const handleChange = jest.fn();
    const handleFieldTouched = jest.fn();

    const buildComp = (componentProps, value) => {
        const mainComponent = shallowWithTheme(<MultipleSelect {...componentProps}/>, {}, dsGenericTheme);
        const RenderProps = mainComponent.props().render;
        return shallowWithTheme(<RenderProps field={{value: value}} form={{setFieldTouched: handleFieldTouched, setFieldValue: handleChange}}/>, {}, dsGenericTheme);
    };

    it('should bind id correctly', () => {
        const cmp = buildComp(props);

        expect(cmp.props().id).toBe(props.id);
    });

    it('should display each option given', () => {
        const cmp = buildComp(props);

        const labels = cmp.props().options.map(o => o.label);
        const values = cmp.props().options.map(o => o.value);
        props.field.valueConstraints.forEach(constraint => {
            expect(values).toContain(constraint.value.string);
            expect(labels).toContain(constraint.displayValue);
        });
    });

    it('should select formik value', () => {
        const cmp = buildComp(props, ['yoloooFR']);
        const selection = [{value: 'yoloooFR2'}];
        cmp.simulate('change', selection);
        expect(handleChange).toHaveBeenCalledWith('myOption', ['yoloooFR2'], true);
        expect(handleFieldTouched).toHaveBeenCalledWith('myOption', [true]);
    });

    it('should select value', () => {
        const cmp = buildComp(props, ['Yolooo']);
        expect(cmp.props().value).toEqual([{label: 'yoloooFR', value: 'Yolooo'}]);
    });

    it('should set readOnly to true when fromdefinition is readOnly', () => {
        testReadOnly(true);
    });

    it('should set readOnly to false when fromdefinition is not readOnly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = buildComp(props);

        expect(cmp.props().readOnly).toEqual(readOnly);
    };
});
