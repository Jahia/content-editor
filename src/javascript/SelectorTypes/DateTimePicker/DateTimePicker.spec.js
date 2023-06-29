import React from 'react';
import {shallow} from '@jahia/test-framework';

import {DateTimePicker} from './DateTimePicker';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

jest.mock('react-redux', () => {
    return {
        ...jest.requireActual('react-redux'),
        useSelector: cb => cb({uilang: 'en'})
    };
});

describe('DateTimePicker component', () => {
    let props;
    let testDateFormat = (navigatorLocale, format) => {
        props.editorContext.browserLang = navigatorLocale;
        const cmp = shallow(<DateTimePicker {...props}/>);

        expect(cmp.props().displayDateFormat).toBe(format);
    };

    beforeEach(() => {
        props = {
            onChange: jest.fn(),
            id: 'myOption[0]',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                readOnly: true,
                selectorOptions: [],
                selectorType: 'DatePicker'
            },
            editorContext: {
                lang: 'fr'
            },
            value: ''
        };
    });

    it('should bind id correctly', () => {
        const cmp = shallow(<DateTimePicker {...props}/>);
        expect(cmp.props().id).toBe(props.id);
    });

    it('should call onChange with good arguments when calling DatePickerInput onChange', () => {
        const cmp = shallow(<DateTimePicker {...props}/>);
        cmp.simulate('change', '2019-07-14T21:07:12.000');

        expect(props.onChange).toHaveBeenCalledWith('2019-07-14T21:07:12.000');
    });

    it('should give readOnly', () => {
        const cmp = shallow(<DateTimePicker {...props}/>);
        expect(cmp.props().readOnly).toBe(true);
    });

    it('should give readOnly at false', () => {
        props.field.readOnly = false;
        const cmp = shallow(<DateTimePicker {...props}/>);

        expect(cmp.props().readOnly).toBe(false);
    });

    it('should use specific date format when it is handle in specificDateFormat and DD/MM/YYYY otherwise', () => {
        testDateFormat('de-DE', 'DD.MM.YYYY');
        testDateFormat('en-US', 'MM/DD/YYYY');
        testDateFormat('zh-CN', 'YYYY/MM/DD');
        testDateFormat('random', 'DD/MM/YYYY');
    });

    it('should display date variant for DatePicker', () => {
        const cmp = shallow(<DateTimePicker {...props}/>);

        expect(cmp.props().variant).toBe('date');
    });

    it('should display datetime variant for DateTimePicker', () => {
        props.field.selectorType = 'DateTimePicker';
        const cmp = shallow(<DateTimePicker {...props}/>);

        expect(cmp.props().variant).toBe('datetime');
    });

    it('should set constraints on DatePicker', () => {
        props.field.selectorType = 'DatePicker';
        props.field.valueConstraints = [{
            value: {string: '(2019-06-04T00:00:00.000,)'},
            displayValue: 'yolo'
        }];
        const cmp = shallow(<DateTimePicker {...props}/>);

        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-05T00:00:00.000')}]);
    });

    it('should set constraints on DateTimePicker', () => {
        props.field.selectorType = 'DateTimePicker';
        props.field.valueConstraints = [{
            value: {string: '(2019-06-04T10:00:00.000,2019-06-05T10:00:00.000)'},
            displayValue: 'yolo'
        }];
        const cmp = shallow(<DateTimePicker {...props}/>);

        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-04T10:01:00.000')}, {after: new Date('2019-06-05T09:59:00.000')}]);
    });

    it('should set constraints on DateTimePicker with limit inclusion', () => {
        props.field.selectorType = 'DateTimePicker';
        props.field.valueConstraints = [{
            value: {string: '[2019-06-04T00:00:00.000,)'},
            displayValue: 'toto'
        }];
        const cmp = shallow(<DateTimePicker {...props}/>);

        expect(cmp.props().dayPickerProps.disabledDays).toEqual([{before: new Date('2019-06-04T00:00:00.000')}]);
    });
});
