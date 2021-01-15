import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from '~/SelectorTypes/Text/Text';
import {MultipleFieldCmp} from './MultipleField';
import {TextAreaField} from '~/SelectorTypes/TextArea/TextArea';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

describe('Multiple component', () => {
    let defaultProps;

    beforeEach(() => {
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
    });

    it('should contains multiple fields', () => {
        defaultProps.inputContext.fieldComponent = props => <Text {...props}/>;
        const cmp = shallowWithTheme(
            <MultipleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('FormikConnect(FastFieldInner)').length).toBe(2);
    });

    it('should call onChange when removing a value', () => {
        generateFieldArrayCmp().find('DsIconButton').at(1).simulate('click');
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Dummy3']);
    });

    it('should call onChange when add a new value', () => {
        generateFieldArrayCmp().find('Button').simulate('click');
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Dummy2', 'Dummy3', undefined]);
    });

    it('should call onChange when modifying a value', () => {
        const arraycmp = generateFieldArrayCmp();
        const field2 = generateFieldCmp(arraycmp, 1).dive().dive();

        // Change field2
        field2.simulate('change', {
            target: {
                value: 'Updated2'
            }
        });
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith(['Dummy1', 'Updated2', 'Dummy3']);
    });

    it('should display remove button when field is not readOnly', () => {
        const removeButton = generateFieldArrayCmp().find('DsIconButton').at(1);
        expect(removeButton.exists()).toBe(true);
    });

    it('should display add button when field is not readOnly', () => {
        const removeButton = generateFieldArrayCmp().find('Button');
        expect(removeButton.exists()).toBe(true);
    });

    it('should hide remove button when field is readOnly', () => {
        defaultProps.field.readOnly = true;

        const removeButton = generateFieldArrayCmp().find('DsIconButton');
        expect(removeButton.exists()).toBe(false);
    });

    it('should hide add button when field is readOnly', () => {
        defaultProps.field.readOnly = true;

        const removeButton = generateFieldArrayCmp().find('Button');
        expect(removeButton.exists()).toBe(false);
    });

    let generateFieldArrayCmp = () => {
        defaultProps.formik = {
            values: {
                text: ['Dummy1', 'Dummy2', 'Dummy3']
            }
        };

        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        return shallowWithTheme(
            <MultipleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );
    };

    const generateFieldCmp = (arrayCmp, index) => {
        return arrayCmp.find('FormikConnect(FastFieldInner)').at(index).renderProp('children')();
    };
});
