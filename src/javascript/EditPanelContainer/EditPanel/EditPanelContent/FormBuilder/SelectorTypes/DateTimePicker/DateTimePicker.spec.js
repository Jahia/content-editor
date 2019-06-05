import React from 'react';
import {shallow} from '@jahia/test-framework';

import {DateTimePicker} from './DateTimePicker';

describe('DateTimePicker component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'dtp1',
            field: {
                formDefinition: {
                    name: 'myOption',
                    readOnly: true
                }
            },
            editorContext: {
                lang: 'fr'
            }
        };
    });

    it('should bind id correctly', () => {
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;

        const cmp = shallow(<RenderProps field={{value: new Date().toISOString(), onChange: jest.fn()}}/>);

        expect(cmp.props().id).toBe(props.id);
    });

    it('should call onChange with good arguments when calling DatePickerInput onChange', () => {
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;

        const formikOnChange = jest.fn();

        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: formikOnChange}}/>);

        cmp.simulate('change', 'stringdate');

        expect(formikOnChange).toHaveBeenCalledWith('myOption', 'stringdate', true);
    });

    it('should give readOnly', () => {
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().readOnly).toBe(true);
    });

    it('should give readOnly at false', () => {
        props.field.formDefinition.readOnly = false;
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().readOnly).toBe(false);
    });
});
