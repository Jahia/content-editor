import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from '~/SelectorTypes/Text/Text';
import {MultipleField} from './MultipleField';
import {TextAreaField} from '~/SelectorTypes/TextAreaField/TextAreaField';
import {useFormikContext} from 'formik';

jest.mock('formik');

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

jest.mock('react-dnd', () => {
    return {
        ...jest.requireActual('react-dnd'),
        useDrop: jest.fn(() => ['drop', 'drop']),
        useDrag: jest.fn(() => ['drop', 'drop'])
    };
});

describe('Multiple component', () => {
    let defaultProps;

    beforeEach(() => {
        useFormikContext.mockReturnValue({
            values: {
                text: ['Dummy1', 'Dummy2']
            }
        });
        defaultProps = {
            editorContext: {},
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
            inputContext: {
                selectorType: {
                    cmp: () => <></>
                }
            },
            classes: {},
            t: jest.fn(),
            remove: jest.fn(),
            onChange: jest.fn(),
            onBlur: jest.fn()
        };
    });

    it('should contain multiple fields', () => {
        defaultProps.inputContext.selectorType.cmp = props => <Text {...props}/>;
        const cmp = shallowWithTheme(
            <MultipleField {...defaultProps}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('OrderableValue').length).toBe(3);
    });

    it('should call onChange when removing a value', () => {
        generateFieldArrayCmp().find('OrderableValue').at(1).shallow().find('Button').simulate('click');
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Dummy3']);
    });

    it('should call onChange when add a new value', () => {
        generateFieldArrayCmp().find('Button');
        generateFieldArrayCmp().find('Button').last().simulate('click');
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Dummy2', 'Dummy3', undefined]);
    });

    it('should call onChange when modifying a value', () => {
        const arrayCmp = generateFieldArrayCmp();
        const field2 = generateFieldCmp(arrayCmp, 1);

        // Change field2
        field2.simulate('change', 'Updated2');
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Updated2', 'Dummy3']);
    });

    it('should display remove button when field is not readOnly', () => {
        const removeButton = generateFieldArrayCmp().find('OrderableValue').at(1).shallow().find('Button');
        expect(removeButton.exists()).toBe(true);
    });

    it('should display add button when field is not readOnly', () => {
        const removeButton = generateFieldArrayCmp().find('Button');
        expect(removeButton.exists()).toBe(true);
    });

    it('should hide remove button when field is readOnly', () => {
        defaultProps.field.readOnly = true;

        const removeButton = generateFieldArrayCmp().find('Button');
        expect(removeButton.exists()).toBe(false);
    });

    it('should hide add button when field is readOnly', () => {
        defaultProps.field.readOnly = true;

        const removeButton = generateFieldArrayCmp().find('Button');
        expect(removeButton.exists()).toBe(false);
    });

    let generateFieldArrayCmp = () => {
        useFormikContext.mockReturnValue({
            values: {
                text: ['Dummy1', 'Dummy2', 'Dummy3']
            }
        });

        defaultProps.inputContext.selectorType.cmp = props => <TextAreaField {...props}/>;
        return shallowWithTheme(
            <MultipleField {...defaultProps}/>,
            {},
            dsGenericTheme
        );
    };

    const generateFieldCmp = (arrayCmp, index) => {
        return arrayCmp.find('OrderableValue').at(index).shallow().find('FormikConnect(FastFieldInner)');
    };
});
