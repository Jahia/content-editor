import React from 'react';
import {shallow} from 'enzyme';

import EditNodePropertyContainer from './EditNodeProperty.container';
import RichText from '../SelectorTypes/RichText';
import Text from '../SelectorTypes/Text';

describe('EditNodeProperty container component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            field: {formDefinition: ''}
        };
        wrapper = shallow(<EditNodePropertyContainer {...props}/>);
    });

    it('should render a Text component when field type is "Text"', () => {
        props.field =
            {formDefinition: {name: 'x', selectorType: 'Text'},
                targets: [{name: 'test'}]};

        wrapper.setProps(props);

        const fieldComponent = wrapper.find(Text);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
    });

    it('should render a RichText component when field type is "RichText"', () => {
        props.field =
            {formDefinition: {name: 'x', selectorType: 'RichText'},
                targets: [{name: 'test'}]};

        wrapper.setProps(props);

        const fieldComponent = wrapper.find(RichText);
        expect(fieldComponent.exists()).toBe(true);
        expect(fieldComponent.length).toBe(1);
    });
});
