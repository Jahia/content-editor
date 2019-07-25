import React from 'react';
import {shallow} from '@jahia/test-framework';

import MultipleSelect from './MultipleSelect';

describe('MultipleSelect component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'MultipleSelect1',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                valueConstraints: [{
                    displayValue: 'yoloooFR',
                    value: {
                        string: 'Yolooo'
                    }
                }, {
                    displayValue: 'yoloooFR2',
                    value: {
                        string: 'Yolooooooooo'
                    }
                }],
                selectorType: 'MultipleSelect',
                readOnly: false,
                multiple: true
            },
            setActionContext: jest.fn()
        };
    });

    it('should bind id correctly', () => {
        const RenderProps = shallow(<MultipleSelect {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{}}/>);

        expect(cmp.props().id).toBe(props.id);
    });

    it('should display each option given', () => {
        const RenderProps = shallow(<MultipleSelect {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{}}/>);

        const labels = cmp.props().options.map(o => o.label);
        const values = cmp.props().options.map(o => o.value);
        props.field.valueConstraints.forEach(constraint => {
            expect(values).toContain(constraint.value.string);
            expect(labels).toContain(constraint.displayValue);
        });
    });

    it('should select formik value', () => {
        const RenderProps = shallow(<MultipleSelect {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: ['Yolooo']}}/>);

        expect(cmp.props().value).toEqual([{label: 'yoloooFR', value: 'Yolooo'}]);
    });

    it('should set readOnly to true when fromdefinition is readOnly', () => {
        testReadOnly(true);
    });

    it('should set readOnly to false when fromdefinition is not readOnly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const RenderProps = shallow(<MultipleSelect {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{}}/>);

        expect(cmp.props().readOnly).toEqual(readOnly);
    };
});
