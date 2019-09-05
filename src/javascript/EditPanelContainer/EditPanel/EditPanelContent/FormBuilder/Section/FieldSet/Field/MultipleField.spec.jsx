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
            }
        };
    });

    it('should contains multiple fields', () => {
        defaultProps.inputContext.fieldComponent = <Text id="text"/>;
        const cmp = shallowWithTheme(
            <MultipleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        let debug = cmp.dive().dive().dive().debug();
        expect(debug).toContain('value="Dummy1" id="text[0]"');
        expect(debug).toContain('value="Dummy2" id="text[1]"');
    });
});
