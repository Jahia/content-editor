import React from 'react';
import {shallow} from '@jahia/test-framework';
import {Color} from './Color';

describe('Color selectorType component', () => {
    let props;
    beforeEach(() => {
        props = {
            onChange: jest.fn(),
            id: 'toto[1]',
            editorContext: {
                uilang: 'en'
            },
            field: {
                name: 'toto',
                displayName: 'toto',
                readOnly: false,
                selectorType: 'Color',
                requiredType: 'STRING',
                targets: [{name: 'test'}],
                selectorOptions: []
            }
        };
    });

    it('should contain aria-labelledby attribute', () => {
        const cmp = shallow(<Color {...props}/>);
        expect(cmp.props().inputProps['aria-labelledby']).toBe('toto-label');
    });

    it('should obtain its initial value', () => {
        props.value = '#fff';
        const cmp = shallow(<Color {...props}/>);
        expect(cmp.props().initialValue).toBe(props.value);
    });

    it('should call onChange on change', () => {
        props.value = '#fff';
        const cmp = shallow(<Color {...props}/>);
        cmp.simulate('change', '#000');

        expect(props.onChange.mock.calls.length).toBe(1);
        expect(props.onChange).toHaveBeenCalledWith('#000');
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = shallow(<Color {...props}/>);
        expect(cmp.props().readOnly).toBe(readOnly);
    };
});
