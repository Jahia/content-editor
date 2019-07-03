import React from 'react';
import {shallow} from '@jahia/test-framework';

import EditNodePropertyContainer from './EditNodeProperty.container';

describe('EditNodeProperty container component', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            field: {
                formDefinition: {
                    name: 'x',
                    displayName: 'displayName',
                    selectorType: 'RichText',
                    readOnly: false,
                    selectorOptions: []
                },
                jcrDefinition: {},
                data: {
                    name: 'x'
                },
                targets: []
            },
            targets: [{name: 'test'}],
            siteInfo: {},
            editorContext: {}
        };
    });

    it('should render a Text component when field type is "Text"', () => {
        defaultProps.field.formDefinition.selectorType = 'Text';
        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>).find('EditNodeProperty');
        expect(cmp.props().selectorType.key).toBe('Text');
    });

    it('should render a RichText component when field type is "RichText"', () => {
        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>).find('EditNodeProperty');
        expect(cmp.props().selectorType.key).toBe('RichText');
    });

    it('should render a ContentPicker component when field type is "picker"', () => {
        defaultProps.field.formDefinition.selectorType = 'Picker';
        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>).find('EditNodeProperty');
        expect(cmp.props().selectorType.key).toBe('ContentPicker');
    });

    it('should render a MediaPicker component when field type is "picker" and option type is "image"', () => {
        defaultProps.field.formDefinition.selectorType = 'Picker';
        defaultProps.field.formDefinition.selectorOptions = [{name: 'type', value: 'image'}];

        const cmp = shallow(<EditNodePropertyContainer {...defaultProps}/>).find('EditNodeProperty');
        expect(cmp.props().selectorType.key).toBe('MediaPicker');
    });
});
