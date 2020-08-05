import {registry} from '@jahia/ui-extender';
import {shallow} from '@jahia/test-framework';
import React from 'react';
import {FieldActionsCmp} from './Field.actions';

describe('Field actions component', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            classes: {
                emptySpace: 'emptySpace'
            },
            inputContext: {},
            selectorType: {
                cmp: () => <div>test</div>,
                key: 'RichText'
            },
            field: {
                name: 'x',
                displayName: 'displayName',
                selectorType: 'RichText',
                readOnly: false,
                selectorOptions: []
            },
            formik: {
                values: {
                    x: 'value'
                }
            }
        };
    });

    it('should render an empty space by default', () => {
        const cmp = shallow(<FieldActionsCmp {...defaultProps}/>);
        expect(cmp.debug()).toContain('emptySpace');
    });

    it('should render the action from inputContext in case it contains a rendering component', () => {
        defaultProps.inputContext.actionRender = <div>actionRender</div>;
        const cmp = shallow(<FieldActionsCmp {...defaultProps}/>);
        expect(cmp.debug()).toContain('actionRender');
    });

    it('should use registered field actions', () => {
        registry.addOrReplace('action', 'RichTextMenu', () => {}, {});
        const cmp = shallow(<FieldActionsCmp {...defaultProps}/>);
        expect(cmp.debug()).toContain('ContextualMenu');
    });

    it('should use registered field actions condition to display or not the menu (test not display)', () => {
        defaultProps.field.multiple = true;
        registry.addOrReplace('action', 'RichTextMenu', () => {}, {
            displayFieldActions: (field, value) => {
                expect(field.multiple).toBe(true);
                expect(value).toBe('value');
                return !field.multiple;
            }
        });
        const cmp = shallow(<FieldActionsCmp {...defaultProps}/>);
        expect(cmp.debug()).toContain('emptySpace');
    });

    it('should use registered field actions condition to display or not the menu (test display)', () => {
        defaultProps.field.multiple = true;
        registry.addOrReplace('action', 'RichTextMenu', () => {}, {
            displayFieldActions: (field, value) => {
                expect(field.multiple).toBe(true);
                expect(value).toBe('value');
                return field.multiple;
            }
        });
        const cmp = shallow(<FieldActionsCmp {...defaultProps}/>);
        expect(cmp.debug()).toContain('ContextualMenu');
    });
});
