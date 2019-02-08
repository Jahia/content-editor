import React from 'react';
import {shallow} from 'enzyme';

import {FormBuilder} from './FormBuilder';

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

    /* Disabled
    it('should render two field components', () => {
        props.fields = [
            {formDefinition: {name: 'x', fieldType: FieldTypes.Text}},
            {formDefinition: {name: 'y', fieldType: FieldTypes.RichText}}
        ];
        wrapper.setProps(props);

        console.log('wrapper:', wrapper.debug());
    });
    */
});
