import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import {SingleFieldCmp} from './SingleField';
import {TextAreaField} from '~/SelectorTypes/TextArea/TextArea';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

describe('Field component', () => {
    let defaultProps;

    beforeEach(() => {
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
    });

    it('the field should have a defined id attribute', () => {
        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        const cmp = buildFieldCmp();

        expect(cmp.debug()).toContain('id="text"');
    });

    it('Should call onChange', () => {
        defaultProps.inputContext.fieldComponent = props => <TextAreaField {...props}/>;
        const cmp = buildFieldCmp().dive().dive();

        // Update field
        cmp.simulate('change', {
            target: {
                value: 'Updated'
            }
        });
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange).toHaveBeenCalledWith('Updated');
    });

    let buildFieldCmp = () => {
        const cmp = shallowWithTheme(
            <SingleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        return cmp.dive().dive().find('FastFieldInner').renderProp('children')();
    };
});
