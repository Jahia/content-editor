import React from 'react';
import {shallow} from '@jahia/test-framework';

import {TextAreaField} from './TextAreaField';

describe('TextArea component', () => {
    let props;
    beforeEach(() => {
        props = {
            onChange: jest.fn(),
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

    it('should field not be readOnly', () => {
        const cmp = shallow(<TextAreaField {...props}/>);

        expect(cmp.props().readOnly).toBe(false);
    });

    it('should set initial value', () => {
        const cmp = shallow(<TextAreaField {...props}/>);
        expect(cmp.props().value).toBe(props.value);
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
