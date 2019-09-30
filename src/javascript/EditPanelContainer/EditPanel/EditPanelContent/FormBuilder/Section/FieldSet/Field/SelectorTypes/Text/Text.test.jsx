import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {TextCmp} from './Text';

describe('Text component', () => {
    let props;
    let mainComponent;

    beforeEach(() => {
        props = {
            id: 'toto[1]',
            editorContext: {
                uiLang: 'en'
            },
            field: {
                name: 'toto',
                displayName: 'toto',
                readOnly: false,
                selectorType: 'Text',
                requiredType: 'STRING',
                targets: [{name: 'test'}]
            }
        };
    });

    const handleChange = jest.fn();

    const buildComp = props => {
        mainComponent = shallowWithTheme(<TextCmp {...props}/>, {}, dsGenericTheme);
        const RenderProps = mainComponent.props().render;
        return shallowWithTheme(<RenderProps form={{setFieldTouched: () => {}, handleChange: handleChange}}/>, {}, dsGenericTheme);
    };

    it('should contain aria-labelledby attribute', () => {
        const wrapper = buildComp(props);
        expect(wrapper.props().inputProps['aria-labelledby']).toBe('toto-label');
    });

    it('should contain one Input component', () => {
        const wrapper = buildComp(props);
        expect(wrapper.find('Input').length).toBe(1);
    });

    it('should contain a matching Input props values', () => {
        const wrapper = buildComp(props);
        expect(wrapper.props().id).toBe(props.id);
        expect(wrapper.props().name).toBe(props.id);
    });

    it('should obtain its initial value from value param', () => {
        const fieldValue = 'some dummy value';

        props.value = fieldValue;
        const wrapper = buildComp(props);

        expect(wrapper.props().value).toBe(fieldValue);
    });

    it('should call formik.handleChange on change', () => {
        const wrapper = buildComp(props);

        wrapper.find('Input').simulate('change');

        expect(handleChange.mock.calls.length).toBe(1);
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const wrapper = buildComp(props);
        expect(wrapper.props().readOnly).toBe(readOnly);
    };

    it('should be the input of type number in case of long, decimal or double', () => {
        props.field.requiredType = 'DOUBLE';
        const wrapper = buildComp(props);

        expect(wrapper.props().type).toBe('number');
    });

    it('should be the input of type text', () => {
        const wrapper = buildComp(props);
        expect(wrapper.props().type).toBe('text');
    });

    it('should input of type number have decimal scale equals 0 if it is long', () => {
        props.field.requiredType = 'LONG';
        const wrapper = buildComp(props);

        expect(wrapper.props().decimalScale).toBe(0);
    });

    it('should input of type number have decimal scale undefined if it is double', () => {
        props.field.requiredType = 'DOUBLE';
        const wrapper = buildComp(props);

        expect(wrapper.props().decimalScale).toBe(undefined);
    });

    it('should input of type number use point as decimal separator when language is "en"', () => {
        props.editorContext.uiLang = 'en';
        const wrapper = buildComp(props);

        expect(wrapper.props().decimalSeparator).toBe('.');
    });

    it('should input of type number use comma as decimal separator when language is "fr"', () => {
        props.editorContext.uiLang = 'fr';
        const wrapper = buildComp(props);

        expect(wrapper.props().decimalSeparator).toBe(',');
    });
});
