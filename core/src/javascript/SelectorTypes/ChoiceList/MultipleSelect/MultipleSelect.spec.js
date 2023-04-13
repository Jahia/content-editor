import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {MultipleSelect} from './MultipleSelect';
import {dsGenericTheme} from '@jahia/design-system-kit';

let mockUseEffect = [];

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => {
            mockUseEffect.push(cb());
        }
    };
});

describe('MultipleSelect component', () => {
    let props;
    let onChange = jest.fn();

    beforeEach(() => {
        props = {
            onChange,
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
            inputContext: {}
        };
    });

    const buildComp = (componentProps, value) => {
        props.value = value;
        return shallowWithTheme(<MultipleSelect {...componentProps}/>, {}, dsGenericTheme).find('Dropdown');
    };

    it('should bind id correctly', () => {
        const cmp = buildComp(props);

        expect(cmp.props().id).toBe(props.id);
    });

    it('should display each option given', () => {
        const cmp = buildComp(props);

        const labels = cmp.props().data.map(o => o.label);
        const values = cmp.props().data.map(o => o.value);
        props.field.valueConstraints.forEach(constraint => {
            expect(values).toContain(constraint.value.string);
            expect(labels).toContain(constraint.displayValue);
        });
    });

    it('should select value', () => {
        const cmp = buildComp(props, ['Yolooo']);
        expect(cmp.props().values).toEqual(['Yolooo']);
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

        expect(cmp.props().isDisabled).toEqual(readOnly);
    };
});
