import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from './SelectorTypes/Text/Text';
import {MultipleFieldCmp} from './MultipleField';

describe('Multiple component', () => {
    let defaultProps;
    let defaultPropsFieldArray;

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
                fieldComponent: <></>
            },
            classes: {},
            t: jest.fn(),
            remove: jest.fn()
        };

        defaultPropsFieldArray = {
            remove: jest.fn(),
            push: jest.fn()
        };
    });

    it('should contains multiple fields', () => {
        defaultProps.inputContext.fieldComponent = <Text id="text"/>;
        const cmp = shallowWithTheme(
            <MultipleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        const debug = cmp.dive().dive().dive().debug();
        expect(debug).toContain('value="Dummy1" id="text[0]"');
        expect(debug).toContain('value="Dummy2" id="text[1]"');
    });

    it('should call onClick when click on remove button', () => {
        generateFieldArrayCmp().find('DsIconButton').at(1).simulate('click');
        expect(defaultPropsFieldArray.remove).toHaveBeenCalled();
    });

    it('should call onClick when click on add button', () => {
        generateFieldArrayCmp().find('DsButton').simulate('click');
        expect(defaultPropsFieldArray.push).toHaveBeenCalled();
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

        defaultProps.inputContext.fieldComponent = <Text id="text"/>;
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
});
