import React from 'react';
import {shallow} from '@jahia/test-framework';

import {TextAreaField} from './TextArea';

let useEffect;

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => {
            useEffect = cb();
        }
    };
});

describe('TextArea component', () => {
    let props;
    const onDestroy = jest.fn();
    beforeEach(() => {
        props = {
            onDestroy,
            onChange: jest.fn(),
            onInit: jest.fn(),
            value: 'Yolooo',
            id: 'textArea1',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                readOnly: false,
                selectorType: 'TextArea'
            },
            classes: {}
        };
    });

    it('should field be readOnly', () => {
        props.field.readOnly = true;
        const cmp = shallow(<TextAreaField {...props}/>);

        expect(cmp.props().readOnly).toBe(true);
    });

    it('should onDestroy called when element detached the element', () => {
        const cmp = shallow(<TextAreaField {...props}/>);
        cmp.unmount();
        useEffect();
        expect(onDestroy).toHaveBeenCalled();
    });

    it('should field not be readOnly', () => {
        const cmp = shallow(<TextAreaField {...props}/>);

        expect(cmp.props().readOnly).toBe(false);
    });

    it('should call onInit on display', () => {
        shallow(<TextAreaField {...props}/>);

        expect(props.onInit.mock.calls.length).toBe(1);
        expect(props.onInit).toHaveBeenCalledWith(props.value);
    });

    it('should call onChange on change', () => {
        const cmp = shallow(<TextAreaField {...props}/>);
        cmp.find('WithStyles(TextAreaCmp)').simulate('change', {
            target: {
                value: 'text'
            }
        });

        expect(props.onChange.mock.calls.length).toBe(1);
        expect(props.onChange).toHaveBeenCalledWith('text');
    });
});
