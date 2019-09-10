import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from './SelectorTypes/Text/Text';
import {MultipleFieldCmp} from './MultipleField';

describe('Multiple component', () => {
    let defaultProps;

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
        cmp = shallowWithTheme(
            <FieldArrayRender {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        cmp.find('DsIconButton').at(1).simulate('click');
        expect(defaultProps.remove).toHaveBeenCalled();
    });
});
