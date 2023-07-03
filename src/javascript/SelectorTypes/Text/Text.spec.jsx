import React from 'react';
import {shallow} from '@jahia/test-framework';
import {useSelector} from 'react-redux';

import {Text} from './Text';

jest.mock('react-redux', () => {
    return {
        ...jest.requireActual('react-redux'),
        useSelector: jest.fn()
    };
});

describe('Text component', () => {
    let props;
    let state = {
        uilang: 'en'
    };

    beforeEach(() => {
        props = {
            onChange: jest.fn(),
            id: 'toto[1]',
            field: {
                name: 'toto',
                displayName: 'toto',
                readOnly: false,
                selectorType: 'Text',
                requiredType: 'STRING',
                targets: [{name: 'test'}],
                selectorOptions: []
            }
        };

        useSelector.mockImplementation(cb => cb(state));
    });

    it('should contain aria-labelledby attribute', () => {
        const cmp = shallow(<Text {...props}/>);
        expect(cmp.props().inputProps['aria-labelledby']).toBe('toto-label');
    });

    it('should contain one Input component', () => {
        const cmp = shallow(<Text {...props}/>);
        expect(cmp.find('Input').length).toBe(1);
    });

    it('should contain a matching Input props values', () => {
        const cmp = shallow(<Text {...props}/>);
        expect(cmp.props().id).toBe(props.id);
        expect(cmp.props().name).toBe(props.id);
    });

    it('should obtain its initial value', () => {
        props.value = 'some dummy value';
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().value).toBe(props.value);
    });

    it('should call onChange on change', () => {
        props.value = 'toto';
        const cmp = shallow(<Text {...props}/>);
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
        const cmp = shallow(<Text {...props}/>);
        expect(cmp.props().readOnly).toBe(readOnly);
    };

    it('should be the input of type number in case of long, decimal or double', () => {
        props.field.requiredType = 'DOUBLE';
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().type).toBe('number');
    });

    it('should be the input of type text', () => {
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().type).toBe('text');
    });

    it('should input of type number have decimal scale equals 0 if it is long', () => {
        props.field.requiredType = 'LONG';
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().decimalScale).toBe(0);
    });

    it('should input of type number have decimal scale undefined if it is double', () => {
        props.field.requiredType = 'DOUBLE';
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().decimalScale).toBe(undefined);
    });

    it('should input of type number use point as decimal separator when language is "en"', () => {
        state.uilang = 'en';
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().decimalSeparator).toBe('.');
    });

    it('should input of type number use comma as decimal separator when language is "fr"', () => {
        state.uilang = 'fr';
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().decimalSeparator).toBe(',');
    });

    it('should be the input of type password', () => {
        props.field.selectorOptions = [{name: 'password'}];
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().type).toBe('password');
    });

    it('should the interactive button manage right type for the input of type password', () => {
        props.field.selectorOptions = [{name: 'password'}];
        const cmp = shallow(<Text {...props}/>);

        expect(cmp.props().type).toBe('password');

        cmp.props().variant.interactive.props.onClick();
        expect(cmp.props().type).toBe('text');

        cmp.props().variant.interactive.props.onClick();
        expect(cmp.props().type).toBe('password');
    });
});
