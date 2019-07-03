import React from 'react';
import {shallow} from '@jahia/test-framework';

import ChoiceList from './ChoiceList';

describe('Choicelist component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'choiceList1',
            field: {
                formDefinition: {
                    name: 'myOption',
                    valueConstraints: [{
                        displayValue: 'yoloooFR',
                        value: {
                            string: 'Yolooo'
                        }
                    }],
                    selectorType: 'ChoiceList',
                    readOnly: false
                },
                data: {
                    name: 'myOption'
                },
                jcrDefinition: {},
                targets: []
            },
            classes: {}
        };
    });

    it('should bind id correctly', () => {
        const RenderProps = shallow(<ChoiceList {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}}/>);

        expect(cmp.props().inputProps.id).toBe(props.id);
    });

    it('should display each option given', () => {
        const RenderProps = shallow(<ChoiceList {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}}/>);

        props.field.formDefinition.valueConstraints.forEach(constraint => {
            expect(cmp.debug()).toContain(constraint.displayValue);
        });
    });

    it('should replace null value as empty string', () => {
        const RenderProps = shallow(<ChoiceList {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{}}/>);

        expect(cmp.props().value).toBe('');
    });

    it('should select formik value', () => {
        const RenderProps = shallow(<ChoiceList {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}}/>);

        expect(cmp.props().value).toBe('Yolooo');
    });

    it('should set readOnly to true when fromdefinition is readOnly', () => {
        testReadOnly(true);
    });

    it('should set readOnly to false when fromdefinition is not readOnly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.formDefinition.readOnly = readOnly;
        const RenderProps = shallow(<ChoiceList {...props}/>).dive().props().render;
        const cmp = shallow(<RenderProps field={{}}/>);
        const inputCmp = shallow(cmp.props().input);

        expect(inputCmp.props().readOnly).toEqual(readOnly);
    };
});
