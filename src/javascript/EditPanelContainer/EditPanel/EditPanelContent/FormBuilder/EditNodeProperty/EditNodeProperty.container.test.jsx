import React from 'react';
import {shallow} from '@jahia/test-framework';

import EditNodePropertyContainer from './EditNodeProperty.container';
import RichText from '../SelectorTypes/RichText';
import Text from '../SelectorTypes/Text';
import MediaPicker from '../SelectorTypes/MediaPicker';

describe('EditNodeProperty container component', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            field: {formDefinition: {name: 'x', selectorType: 'RichText'}},
            targets: [{name: 'test'}],
            siteInfo: {}
        };
    });

    it('should render a Text component when field type is "Text"', () => {
        defaultProps.field.formDefinition.selectorType = 'Text';
        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>);

        const fieldComponent = cmp.find(Text);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
    });

    it('should render a RichText component when field type is "RichText"', () => {
        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>);

        const fieldComponent = cmp.find(RichText);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
    });

    it('should render a Picker component when field type is "picker"', () => {
        defaultProps.field.formDefinition.selectorType = 'Picker';
        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>);

        const fieldComponent = cmp.find(MediaPicker);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
    });

    it('should generate an ID for EditNodeProperty and selectorType composant', () => {
        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>);

        expect(cmp.find(RichText).props().id).toBe('x');
        expect(cmp.props().labelHtmlFor).toEqual('x');
    });
});
