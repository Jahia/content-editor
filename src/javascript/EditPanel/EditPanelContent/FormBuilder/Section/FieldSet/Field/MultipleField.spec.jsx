import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from './SelectorTypes/Text/Text';
import {MultipleFieldCmp} from './MultipleField';
import {TextAreaField} from './SelectorTypes/TextArea/TextArea';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

describe('Multiple component', () => {
    let defaultProps;
    let defaultPropsFieldArray;
    let defaultPropsFastField;

    beforeEach(() => {
        defaultProps = {
            field: {
                multiple: true,
                name: 'text',
                displayName: 'displayName',
                nodeType: {
                    properties: [
                        {
                            name: 'text',
                            displayName: 'Text'
                        }
                    ]
                },
                readOnly: false,
                selectorType: 'Text',
                selectorOptions: []
            },
            formik: {
                values: {
                    text: ['Dummy1', 'Dummy2']
                }
            },
            inputContext: {
                fieldComponent: () => <></>
            },
            classes: {},
            t: jest.fn(),
            remove: jest.fn(),
            onChange: jest.fn()
        };

        defaultPropsFieldArray = {
            remove: jest.fn(),
            push: jest.fn()
        };

        defaultPropsFastField = {
            form: {
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn()
            }
        };
    });

    it('should contains multiple fields', () => {
        defaultProps.inputContext.fieldComponent = props => <Text {...props}/>;
        const cmp = shallowWithTheme(
            <MultipleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().dive().dive().find('FormikConnect(FastFieldInner)').length).toBe(2);
    });

    it('should call onClick when click on remove button', () => {
        const arraycmp = generateFieldArrayCmp();
        generateFieldCmp(arraycmp, 0).dive().dive().dive().debug();
        generateFieldCmp(arraycmp, 1).dive().dive().dive().debug();
        generateFieldCmp(arraycmp, 2).dive().dive().dive().debug();

        arraycmp.find('DsIconButton').at(1).simulate('click');
        expect(defaultPropsFieldArray.remove).toHaveBeenCalled();
    });

    it('should call onClick when click on add button', () => {
        generateFieldArrayCmp().find('DsButton').simulate('click');
        expect(defaultPropsFieldArray.push).toHaveBeenCalled();
    });

    it('should call onChange', () => {
        const arraycmp = generateFieldArrayCmp();
        generateFieldCmp(arraycmp, 0).dive().dive();
        const field2 = generateFieldCmp(arraycmp, 1).dive().dive();
        generateFieldCmp(arraycmp, 2).dive().dive();

        // Init should call onChange with initial values
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith(undefined, ['Dummy1', 'Dummy2', 'Dummy3']);

        // Change field2
        defaultProps.onChange.mockReset();
        field2.simulate('change', {
            target: {
                value: 'Updated2'
            }
        });
        expect(defaultPropsFastField.form.setFieldValue).toHaveBeenCalledWith('text[1]', 'Updated2', true);
        expect(defaultPropsFastField.form.setFieldTouched).toHaveBeenCalledWith('text', [true]);
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Dummy2', 'Dummy3'], ['Dummy1', 'Updated2', 'Dummy3']);

        // Remove Dummy1
        defaultProps.onChange.mockReset();
        arraycmp.find('DsIconButton').at(0).simulate('click');
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Updated2', 'Dummy3'], ['Updated2', 'Dummy3']);

        // Add value should not trigger onChange
        defaultProps.onChange.mockReset();
        arraycmp.find('DsButton').simulate('click');
        expect(defaultProps.onChange).not.toHaveBeenCalled();
        console.log('tolo');
    });

    it('should display remove button when field is not readOnly', () => {
        const removeButton = generateFieldArrayCmp().find('DsIconButton').at(1);
        expect(removeButton.exists()).toBe(true);
    });

    it('should display add button when field is not readOnly', () => {
        const removeButton = generateFieldArrayCmp().find('DsButton');
        expect(removeButton.exists()).toBe(true);
    });

    it('should hide remove button when field is readOnly', () => {
        defaultProps.field.readOnly = true;

        const removeButton = generateFieldArrayCmp().find('DsIconButton');
        expect(removeButton.exists()).toBe(false);
    });

    it('should hide add button when field is readOnly', () => {
        defaultProps.field.readOnly = true;

        const removeButton = generateFieldArrayCmp().find('DsButton');
        expect(removeButton.exists()).toBe(false);
    });

    let generateFieldArrayCmp = () => {
        defaultProps.formik = {
            values: {
                text: ['Dummy1', 'Dummy2', 'Dummy3']
            }
        };

        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        let cmp = shallowWithTheme(
            <MultipleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        const FieldArrayRender = cmp.dive().dive().props().render;
        return shallowWithTheme(
            <FieldArrayRender {...defaultPropsFieldArray}/>,
            {},
            dsGenericTheme
        );
    };

    let generateFieldCmp = (arrayCmp, index) => {
        const FieldRender = arrayCmp.find('FormikConnect(FastFieldInner)').at(index).props().render;
        return shallowWithTheme(
            <FieldRender {...defaultPropsFastField}/>,
            {},
            dsGenericTheme
        );
    };
});
