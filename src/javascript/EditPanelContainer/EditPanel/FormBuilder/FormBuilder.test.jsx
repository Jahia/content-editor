import React from 'react';
import {shallow} from 'enzyme';

import {FormBuilder} from './FormBuilder';
import RichText from './SelectorTypes/RichText';
import Text from './SelectorTypes/Text';

describe('FormBuilder component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            fields: [],
            formik: {
                handleSubmit: () => {}
            }
        };
        wrapper = shallow(<FormBuilder {...props}/>);
    });

    it('should call formik.handleSubmit on submit', () => {
        props.formik.handleSubmit = jest.fn();

        wrapper.setProps(props)
            .find('form')
            .simulate('submit');

        expect(props.formik.handleSubmit.mock.calls.length).toBe(1);
    });

    it('should render a Text component when field type is "Text"', () => {
        props.fields = [
            {formDefinition: {name: 'x', selectorType: 'Text'}}
        ];

        wrapper.setProps(props);

        const fieldComponent = wrapper.find(Text);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
        expect(fieldComponent.props('field')).toEqual({field: props.fields[0]});
    });

    it('should render a RichText component when field type is "RichText"', () => {
        props.fields = [
            {formDefinition: {name: 'x', selectorType: 'RichText'}}
        ];

        wrapper.setProps(props);

        const fieldComponent = wrapper.find(RichText);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
        expect(fieldComponent.props('field')).toEqual({field: props.fields[0]});
    });

    it('should render one field component per field definition', () => {
        props.fields = [
            {formDefinition: {name: 'x', selectorType: 'Text'}},
            {formDefinition: {name: 'y', selectorType: 'Text'}}
        ];

        wrapper.setProps(props);

        expect(wrapper.find(Text).length).toBe(2);
    });
});
