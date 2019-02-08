import React from 'react';
import {shallow} from 'enzyme';

import {RichText} from './RichText';

const RICH_TEXT_COMPONENT_TAG = 'n'; // TODO why is that?

describe('RichText component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            field: {
                formDefinition: {
                    name: 'x'
                }
            },
            formik: {
                setFieldValue: () => {},
                values: []
            }
        };
        wrapper = shallow(<RichText {...props}/>);
    });

    it('should contain one RichText component', () => {
        expect(wrapper.find(RICH_TEXT_COMPONENT_TAG).length).toBe(1);
    });

    it('should obtain its initial value from formik.values', () => {
        const fieldName = props.field.formDefinition.name;
        const fieldValue = 'some dummy value';

        props.formik.values[fieldName] = fieldValue;

        expect(wrapper.setProps(props)
            .find(RICH_TEXT_COMPONENT_TAG)
            .prop('data')
        ).toEqual(fieldValue);
    });

    it('should call formik.setFieldValue on change', () => {
        const dummyEditor = {
            getData: () => 'some dummy value'
        };

        props.formik.setFieldValue = jest.fn();

        wrapper.setProps(props)
            .find(RICH_TEXT_COMPONENT_TAG)
            .simulate('change', {editor: dummyEditor});

        expect(props.formik.setFieldValue.mock.calls.length).toBe(1);
        expect(props.formik.setFieldValue.mock.calls).toEqual([[
            props.field.formDefinition.name, dummyEditor.getData(), true
        ]]);
    });
});
