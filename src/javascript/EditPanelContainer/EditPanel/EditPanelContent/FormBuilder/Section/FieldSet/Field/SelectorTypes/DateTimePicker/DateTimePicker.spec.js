import React from 'react';
import {shallow, shallowWithTheme} from '@jahia/test-framework';

import {DateTimePicker} from './DateTimePicker';
import {dsGenericTheme} from '@jahia/design-system-kit';

describe('DateTimePicker component', () => {
    let props;

    let testDateFormat = (uiLang, format) => {
        props.editorContext.uiLang = uiLang;
        const RenderProps = shallow(<DateTimePicker {...props}/>)
            .props().component;
        const cmp = shallow(<RenderProps field={{value: new Date().toISOString()}} form={{setFieldTouched: () => {}, setFieldValue: () => {}}}/>);

        expect(cmp.props().displayDateFormat).toBe(format);
    };

    beforeEach(() => {
        props = {
            id: 'myOption[0]',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                readOnly: true,
                selectorOptions: [],
                selectorType: 'DatePicker'
            },
            editorContext: {
                lang: 'fr',
                uiLang: 'fr'
            }
        };
    });

    const handleChange = jest.fn();

    const buildComp = componentProps => {
        const mainComponent = shallowWithTheme(<DateTimePicker {...componentProps}/>, {}, dsGenericTheme);
        const RenderProps = mainComponent.props().component;
        return shallowWithTheme(<RenderProps field={{value: new Date().toISOString(), onChange: jest.fn()}} form={{setFieldTouched: () => {}, setFieldValue: handleChange}}/>, {}, dsGenericTheme);
    };

    it('should bind id correctly', () => {
        const cmp = buildComp(props);
        expect(cmp.props().id).toBe(props.id);
    });

    it('should call onChange with good arguments when calling DatePickerInput onChange', () => {
        const cmp = buildComp(props);

        cmp.simulate('change', '2019-07-14T21:07:12.000');

        expect(handleChange).toHaveBeenCalledWith('myOption[0]', '2019-07-14T21:07:12.000', true);
    });

    it('should give readOnly', () => {
        const cmp = buildComp(props);
        expect(cmp.props().readOnly).toBe(true);
    });

    it('should give readOnly at false', () => {
        props.field.readOnly = false;
        const cmp = buildComp(props);

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
        const cmp = buildComp(props);
        expect(cmp.props().variant).toBe('date');
    });

    it('should display datetime variant for DateTimePicker', () => {
        props.field.selectorType = 'DateTimePicker';
        const cmp = buildComp(props);
        expect(cmp.props().variant).toBe('datetime');
    });

    it('should set constraints on DatePicker', () => {
        props.field.selectorType = 'DatePicker';
        props.field.valueConstraints = [{
            value: {string: '(2019-06-04T00:00:00.000,)'},
            displayValue: 'yolo'
        }];
        const cmp = buildComp(props);
        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-05T00:00:00.000')}]);
    });

    it('should set constraints on DateTimePicker', () => {
        props.field.selectorType = 'DateTimePicker';
        props.field.valueConstraints = [{
            value: {string: '(2019-06-04T10:00:00.000,2019-06-05T10:00:00.000)'},
            displayValue: 'yolo'
        }];
        const cmp = buildComp(props);
        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-04T10:01:00.000')}, {after: new Date('2019-06-05T09:59:00.000')}]);
    });

    it('should set constraints on DateTimePicker with limit inclusion', () => {
        props.field.selectorType = 'DateTimePicker';
        props.field.valueConstraints = [{
            value: {string: '[2019-06-04T00:00:00.000,)'},
            displayValue: 'toto'
        }];
        const cmp = buildComp(props);
        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-04T00:00:00.000')}]);
    });
});
