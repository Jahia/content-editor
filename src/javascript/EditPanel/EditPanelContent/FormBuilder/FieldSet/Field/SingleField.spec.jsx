import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import {SingleFieldCmp} from './SingleField';
import {TextAreaField} from '~/SelectorTypes/TextArea/TextArea';
import {FastField, useFormikContext} from 'formik';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});
jest.mock('formik');

describe('Field component', () => {
    let formik;
    let defaultProps;

    beforeEach(() => {
        formik = {
            values: {
                text: 'Dummy'
            }
        };
        useFormikContext.mockReturnValue(formik);

        defaultProps = {
            editorContext: {},
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
            inputContext: {
                fieldComponent: () => <></>,
                editorContext: {}
            },
            onChange: jest.fn()
        };
    });

    it('the field should have a defined id attribute', () => {
        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        const cmp = buildFieldCmp();

        expect(cmp.debug()).toContain('id="text"');
    });

    it('Should call onChange', () => {
        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        const cmp = buildFieldCmp();

        // Update field
        cmp.simulate('change', 'Updated');
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith('Updated');
    });

    let buildFieldCmp = () => {
        const cmp = shallowWithTheme(
            <SingleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        return cmp.find(FastField);
    };
});
