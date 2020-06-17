/* TODO fix
import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from './SelectorTypes/Text/Text';
import {SingleFieldCmp} from './SingleField';

describe('Field component', () => {
    let defaultProps;

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
            }
        };
    });

    it('the field should have a defined id attribute', () => {
        defaultProps.inputContext.fieldComponent = props => <Text {...props}/>;
        const cmp = shallowWithTheme(
            <SingleFieldCmp {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('id="text"');
    });
}); */

describe('Field component', () => {
    it('the field should have a defined id attribute', () => {
        console.log('TODO');
    });
});
