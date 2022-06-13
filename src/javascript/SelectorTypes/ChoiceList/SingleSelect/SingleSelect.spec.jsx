import React from 'react';
import {shallow} from '@jahia/test-framework';

import {SingleSelect} from './SingleSelect';

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
            inputContext: {
            }
        };
    });

    const buildComp = (componentProps, value) => {
        componentProps.value = value;
        return shallow(<SingleSelect {...componentProps}/>).find('Dropdown');
    };

    const addValueConstraint = (displayValue, value) => {
        props.field.valueConstraints.push({
            displayValue: displayValue,
            value: {
                string: value
            }
        });
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

    it('should be searchable if 5+ options', () => {
        addValueConstraint('Display 1', 'value1');
        addValueConstraint('Display 2', 'value2');
        addValueConstraint('Display 3', 'value3');
        addValueConstraint('Display 4', 'value4');
        const cmp = buildComp(props, 'Yolooo');
        expect(cmp.props().hasSearch).toBe(true);
    });

    it('should not be searchable if less than 5 options', () => {
        const cmp = buildComp(props, 'Yolooo');
        expect(cmp.props().hasSearch).toBe(false);
    });

    it('should display image', () => {
        const propsWithImage = {...props};
        propsWithImage.field.valueConstraints[0].properties = [{
            name: 'image',
            value: 'url-to-image'
        }];
        const cmp = buildComp(props, 'Yolooo');
        expect(cmp.props().data[0].image.props.src).toBe('url-to-image');
    });

    it('should replace null value as empty string', () => {
        const cmp = buildComp(props);
        expect(cmp.props().value).toBe(null);
    });

    it('should select formik value', () => {
        const cmp = buildComp(props);
        const onChangeData = {
            value: 'Yolooo'
        };
        cmp.simulate('change', null, onChangeData);

        expect(onChange).toHaveBeenCalled();
        // OnChange has been called twice, one time at init, 2nd time when updated the value.
        expect(onChange.mock.calls[0][0]).toStrictEqual('Yolooo');
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
