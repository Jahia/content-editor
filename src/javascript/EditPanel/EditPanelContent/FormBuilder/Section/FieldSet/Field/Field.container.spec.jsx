import React from 'react';
import {shallow} from '@jahia/test-framework';

import {FieldContainer} from './Field.container';
import {registerSelectorTypes} from '~/SelectorTypes';
import {registry} from '@jahia/ui-extender';

describe('Field container component', () => {
    registerSelectorTypes(registry);

    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            field: {
                name: 'x',
                displayName: 'displayName',
                selectorType: 'RichText',
                readOnly: false,
                selectorOptions: []
            },
            targets: [{name: 'test'}],
            editorContext: {}
        };
    });

    it('should render a Text component when field type is "Text"', () => {
        defaultProps.field.selectorType = 'Text';
        const cmp = shallow(<FieldContainer {...defaultProps}/>).dive().dive().find('Field');
        expect(cmp.props().selectorType.key).toBe('Text');
    });

    it('should render a RichText component when field type is "RichText"', () => {
        const cmp = shallow(<FieldContainer {...defaultProps}/>).dive().dive().find('Field');
        expect(cmp.props().selectorType.key).toBe('RichText');
    });

    it('should render a ContentPicker component when field type is "picker"', () => {
        defaultProps.field.selectorType = 'Picker';
        const cmp = shallow(<FieldContainer {...defaultProps}/>).dive().dive().find('Field');
        expect(cmp.props().selectorType.key).toBe('ContentPickerSelectorType');
    });

    it('should render a MediaPicker component when field type is "picker" and option type is "image"', () => {
        defaultProps.field.selectorType = 'Picker';
        defaultProps.field.selectorOptions = [{name: 'type', value: 'image'}];

        const cmp = shallow(<FieldContainer {...defaultProps}/>).dive().dive().find('Field');
        expect(cmp.props().selectorType.key).toBe('MediaPickerSelectorType');
    });
});
