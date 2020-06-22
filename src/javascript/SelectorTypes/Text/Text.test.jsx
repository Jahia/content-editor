import React from 'react';
import {shallow} from '@jahia/test-framework';

import {TextCmp} from './Text';

let useEffect;

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => {
            useEffect = cb();
        }
    };
});

describe('Text component', () => {
    let props;
    const onDestroy = jest.fn();
    beforeEach(() => {
        props = {
            onDestroy,
            onChange: jest.fn(),
            onInit: jest.fn(),
            id: 'toto[1]',
            editorContext: {
                uilang: 'en'
            },
            field: {
                name: 'toto',
                displayName: 'toto',
                readOnly: false,
                selectorType: 'Text',
                requiredType: 'STRING',
                targets: [{name: 'test'}]
            }
        };
    });

    it('should contain aria-labelledby attribute', () => {
        const cmp = shallow(<TextCmp {...props}/>);
        expect(cmp.props().inputProps['aria-labelledby']).toBe('toto-label');
    });

    it('should onDestroy called when element detached the element', () => {
        const cmp = shallow(<TextCmp {...props}/>);
        cmp.unmount();
        useEffect();
        expect(onDestroy).toHaveBeenCalled();
    });
    it('should contain one Input component', () => {
        const cmp = shallow(<TextCmp {...props}/>);
        expect(cmp.find('Input').length).toBe(1);
    });

    it('should contain a matching Input props values', () => {
        const cmp = shallow(<TextCmp {...props}/>);
        expect(cmp.props().id).toBe(props.id);
        expect(cmp.props().name).toBe(props.id);
    });

    it('should obtain its initial value and call onInit', () => {
        props.value = 'some dummy value';
        const cmp = shallow(<TextCmp {...props}/>);

        expect(cmp.props().value).toBe(props.value);
        expect(props.onInit.mock.calls.length).toBe(1);
        expect(props.onInit).toHaveBeenCalledWith(props.value);
    });

    it('should call onChange on change', () => {
        props.value = 'toto';
        const cmp = shallow(<TextCmp {...props}/>);
        cmp.find('Input').simulate('change', {
            target: {
                value: 'text'
            }
        });

        expect(props.onChange.mock.calls.length).toBe(1);
        expect(props.onChange).toHaveBeenCalledWith('text');
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = shallow(<TextCmp {...props}/>);
        expect(cmp.props().readOnly).toBe(readOnly);
    };

    it('should be the input of type number in case of long, decimal or double', () => {
        props.field.requiredType = 'DOUBLE';
        const cmp = shallow(<TextCmp {...props}/>);

        expect(cmp.props().type).toBe('number');
    });

    it('should be the input of type text', () => {
        const cmp = shallow(<TextCmp {...props}/>);

        expect(cmp.props().type).toBe('text');
    });

    it('should input of type number have decimal scale equals 0 if it is long', () => {
        props.field.requiredType = 'LONG';
        const cmp = shallow(<TextCmp {...props}/>);

        expect(cmp.props().decimalScale).toBe(0);
    });

    it('should input of type number have decimal scale undefined if it is double', () => {
        props.field.requiredType = 'DOUBLE';
        const cmp = shallow(<TextCmp {...props}/>);

        expect(cmp.props().decimalScale).toBe(undefined);
    });

    it('should input of type number use point as decimal separator when language is "en"', () => {
        props.editorContext.uilang = 'en';
        const cmp = shallow(<TextCmp {...props}/>);

        expect(cmp.props().decimalSeparator).toBe('.');
    });

    it('should input of type number use comma as decimal separator when language is "fr"', () => {
        props.editorContext.uilang = 'fr';
        const cmp = shallow(<TextCmp {...props}/>);

        expect(cmp.props().decimalSeparator).toBe(',');
    });
});
