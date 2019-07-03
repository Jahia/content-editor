import React from 'react';
import {shallow} from '@jahia/test-framework';

import {DateTimePicker} from './DateTimePicker';

describe('DateTimePicker component', () => {
    let props;

    let testDateFormat = (uiLang, format) => {
        props.editorContext.uiLang = uiLang;
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().displayDateFormat).toBe(format);
    };

    beforeEach(() => {
        props = {
            id: 'dtp1',
            field: {
                formDefinition: {
                    name: 'myOption',
                    readOnly: true,
                    selectorOptions: [],
                    selectorType: 'DatePicker'
                },
                targets: [],
                data: {
                    name: 'myOption'
                },
                jcrDefinition: {}
            },
            editorContext: {
                lang: 'fr',
                uiLang: 'fr'
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

    it('should use MM/DD/YYYY format when EN and DD/MM/YYYY otherwise', () => {
        testDateFormat('en', 'MM/DD/YYYY');
        testDateFormat('fr', 'DD/MM/YYYY');
        testDateFormat('de', 'DD/MM/YYYY');
        testDateFormat('es', 'DD/MM/YYYY');
        testDateFormat('pt', 'DD/MM/YYYY');
        testDateFormat('it', 'DD/MM/YYYY');
        testDateFormat('random', 'DD/MM/YYYY');
    });

    it('should display date variant for DatePicker', () => {
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().variant).toBe('date');
    });

    it('should display datetime variant for DateTimePicker', () => {
        props.field.formDefinition.selectorType = 'DateTimePicker';
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().variant).toBe('datetime');
    });

    it('should set constraints on DatePicker', () => {
        props.field.formDefinition.selectorType = 'DatePicker';
        props.field.formDefinition.valueConstraints = [{
            value: {string: '(2019-06-04T00:00:00.000,)'},
            displayValue: 'yolo'
        }];
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-05T00:00:00.000')}]);
    });

    it('should set constraints on DateTimePicker', () => {
        props.field.formDefinition.selectorType = 'DateTimePicker';
        props.field.formDefinition.valueConstraints = [{
            value: {string: '(2019-06-04T10:00:00.000,2019-06-05T10:00:00.000)'},
            displayValue: 'yolo'
        }];
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-04T10:01:00.000')}, {after: new Date('2019-06-05T09:59:00.000')}]);
    });

    it('should set constraints on DateTimePicker with limit inclusion', () => {
        props.field.formDefinition.selectorType = 'DateTimePicker';
        props.field.formDefinition.valueConstraints = [{
            value: {string: '[2019-06-04T00:00:00.000,)'},
            displayValue: 'toto'
        }];
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().render;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldValue: () => {}}}/>);

        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-04T00:00:00.000')}]);
    });
});
