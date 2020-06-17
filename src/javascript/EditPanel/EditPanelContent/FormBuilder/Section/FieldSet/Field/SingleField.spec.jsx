import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import {SingleFieldCmp} from './SingleField';
import {TextAreaField} from './SelectorTypes/TextArea/TextArea';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

describe('Field component', () => {
    let defaultProps;
    let defaultPropsFastField;

    beforeEach(() => {
        defaultProps = {
            field: {
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
                selectorType: 'DatePicker',
                selectorOptions: []
            },
            formik: {
                values: {
                    text: 'Dummy'
                }
            },
            inputContext: {
                fieldComponent: () => <></>,
                editorContext: {}
            },
            onChange: jest.fn()
        };

        defaultPropsFastField = {
            form: {
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn()
            }
        };
    });

    it('the field should have a defined id attribute', () => {
        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        const cmp = buildFieldCmp();

        expect(cmp.debug()).toContain('id="text"');
    });

    it('Should call onChange', () => {
        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        const cmp = buildFieldCmp().dive().dive();

        // Init should call onChange with initial values
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith(undefined, 'Dummy');

        // Update field
        defaultProps.onChange.mockReset();
        cmp.simulate('change', {
            target: {
                value: 'Updated'
            }
        });
        expect(defaultPropsFastField.form.setFieldValue).toHaveBeenCalledWith('text', 'Updated', true);
        expect(defaultPropsFastField.form.setFieldTouched).toHaveBeenCalledWith('text', true);
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith('Dummy', 'Updated');
    });

    let buildFieldCmp = () => {
        const cmp = shallowWithTheme(
            <SingleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        const FastFieldRender = cmp.dive().dive().props().render;
        return shallowWithTheme(
            <FastFieldRender {...defaultPropsFastField}/>,
            {},
            dsGenericTheme
        );
    };
});
