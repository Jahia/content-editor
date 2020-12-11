import React from 'react';
import {shallow} from '@jahia/test-framework';

import SingleSelect from './SingleSelect';

let mockUseEffect = [];

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => {
            mockUseEffect.push(cb());
        }
    };
});

describe('SingleSelect component', () => {
    let props;
    let onChange;
    beforeEach(() => {
        onChange = jest.fn();
        props = {
            onChange,
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

    const buildComp = (componentProps, value) => {
        componentProps.value = value;
        return shallow(<SingleSelect {...componentProps}/>);
    };

    it('should bind id correctly', () => {
        const cmp = buildComp(props, 'Yolooo');
        expect(cmp.props().id).toBe('select-' + props.id);
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
        const onChangeData = {
            value: 'Yolooo'
        };
        cmp.simulate('change', null, onChangeData);

        expect(onChange).toHaveBeenCalled();
        // OnChange has been called twice, one time at init, 2nd time when updated the value.
        expect(onChange.mock.calls[0][0]).toStrictEqual(null);
        expect(onChange.mock.calls[1][0]).toStrictEqual('Yolooo');
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
        expect(cmp.props().isDisabled).toEqual(readOnly);
    };
});
