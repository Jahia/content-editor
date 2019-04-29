import React from 'react';
import {shallow} from '@jahia/test-framework';

import {FormBuilder} from './FormBuilder';
import EditNodePropertyContainer from './EditNodeProperty/EditNodeProperty.container';

describe('FormBuilder component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            classes: {},
            fields: [],
            formik: {
                handleSubmit: () => {}
            },
            siteInfo: {},
            editorContext: {}
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

    it('should render one field component per field definition', () => {
        props.fields = [
            {formDefinition: {name: 'x', selectorType: 'Text'},
                targets: [{name: 'test'}]},
            {formDefinition: {name: 'y', selectorType: 'Text'},
                targets: [{name: 'test'}]}
        ];

        wrapper.setProps(props);

        expect(wrapper.find(EditNodePropertyContainer).length).toBe(2);
    });
});
