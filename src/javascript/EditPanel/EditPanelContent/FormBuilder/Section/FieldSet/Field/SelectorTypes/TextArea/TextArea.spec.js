import React from 'react';
import {shallow} from '@jahia/test-framework';

import TextArea from './index';

describe('TextArea component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'textArea1',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                readOnly: false,
                selectorType: 'TextArea'
            },
            classes: {}
        };
    });

    const handleChange = jest.fn();
    const handleFieldTouched = jest.fn();

    it('should bind id correctly', () => {
        const RenderProps = shallow(<TextArea {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}} form={{setFieldTouched: handleFieldTouched, setFieldValue: handleChange}}/>);

        expect(cmp.props().id).toBe(props.id);
    });

    it('should field be readOnly', () => {
        props.field.readOnly = true;
        const RenderProps = shallow(<TextArea {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}} form={{setFieldTouched: handleFieldTouched, setFieldValue: handleChange}}/>);

        expect(cmp.props().readonly).toBe(true);
    });

    it('should call formik.handleChange on change', () => {
        const RenderProps = shallow(<TextArea {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo', onChange: handleChange}} form={{setFieldTouched: handleFieldTouched}}/>);

        cmp.find('WithStyles(TextAreaCmp)').simulate('change', 'text');

        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleFieldTouched).toHaveBeenCalledWith('myOption', true);
    });

    it('should field not be readOnly', () => {
        const RenderProps = shallow(<TextArea {...props}/>).props().render;
        const cmp = shallow(<RenderProps field={{value: 'Yolooo'}} form={{setFieldTouched: handleFieldTouched, setFieldValue: handleChange}}/>);

        expect(cmp.props().readonly).toBe(false);
    });
});
