import React from 'react';
import {shallow} from '@jahia/test-framework';

import TextArea from './index';

describe('TextArea component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'textArea1',
            field: {
                formDefinition: {
                    name: 'myOption',
                    readOnly: false,
                    selectorType: 'TextArea'
                },
                data: {
                    name: 'myOption'
                },
                jcrDefinition: {},
                targets: []
            },
            classes: {}
        };
    });

    it('should bind id correctly', () => {
        const RenderProps = shallow(<TextArea {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}}/>);

        expect(cmp.props().id).toBe(props.id);
    });

    it('should disabled field when readOnly', () => {
        props.field.formDefinition.readOnly = true;
        const RenderProps = shallow(<TextArea {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}}/>);

        expect(cmp.props().disabled).toBe(true);
    });

    it('should not disabled field when not readOnly', () => {
        const RenderProps = shallow(<TextArea {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}}/>);

        expect(cmp.props().disabled).toBe(false);
    });
});
