import React from 'react';
import {shallow} from '@jahia/test-framework';

import SingleSelect from './SingleSelect';

describe('SingleSelect component', () => {
    let props;

    beforeEach(() => {
        props = {
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
            setActionContext: jest.fn()
        };
    });

    it('should bind id correctly', () => {
        const RenderProps = shallow(<SingleSelect {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}} form={{setFieldTouched: () => {}, setFieldValue: () => {}}}/>);

        expect(cmp.props().inputProps.id).toBe(props.id);
    });

    it('should display each option given', () => {
        const RenderProps = shallow(<SingleSelect {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}} form={{setFieldTouched: () => {}, setFieldValue: () => {}}}/>);

        props.field.valueConstraints.forEach(constraint => {
            expect(cmp.debug()).toContain(constraint.displayValue);
        });
    });

    it('should replace null value as empty string', () => {
        const RenderProps = shallow(<SingleSelect {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{}} form={{setFieldTouched: () => {}, setFieldValue: () => {}}}/>);

        expect(cmp.props().value).toBe('');
    });

    it('should select formik value', () => {
        const RenderProps = shallow(<SingleSelect {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}} form={{setFieldTouched: () => {}, setFieldValue: () => {}}}/>);

        expect(cmp.props().value).toBe('Yolooo');
    });

    it('should set readOnly to true when fromdefinition is readOnly', () => {
        testReadOnly(true);
    });

    it('should set readOnly to false when fromdefinition is not readOnly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const RenderProps = shallow(<SingleSelect {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{}} form={{setFieldTouched: () => {}, setFieldValue: () => {}}}/>);
        const inputCmp = shallow(cmp.props().input);

        expect(inputCmp.props().readOnly).toEqual(readOnly);
    };
});
