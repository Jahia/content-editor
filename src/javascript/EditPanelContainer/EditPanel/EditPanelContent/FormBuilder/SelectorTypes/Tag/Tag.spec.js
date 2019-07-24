import React from 'react';
import {shallow} from '@jahia/test-framework';

import Tag from './Tag';

describe('Tag component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'Tag1',
            field: {
                formDefinition: {
                    name: 'myOption',
                    selectorType: 'Tag',
                    readOnly: false,
                    multiple: true
                },
                data: {
                    name: 'myOption',
                    values: ['tag1', 'tag2', 'tag3']
                },
                jcrDefinition: {},
                targets: []
            }
        };
    });

    it('should bind id correctly', () => {
        const RenderProps = shallow(<Tag {...props}/>)
            .dive()
            .props()
            .render;
        const cmp = shallow(<RenderProps field={{}}/>);

        expect(cmp.props().id).toBe(props.id);
    });

    it('should display each option given', () => {
        const RenderProps = shallow(<Tag {...props}/>)
            .dive()
            .props()
            .render;
        const cmp = shallow(<RenderProps field={{}}/>);

        const labels = cmp.props().options.map(o => o.label);
        const values = cmp.props().options.map(o => o.value);
        props.field.data.values.forEach(value => {
            expect(values).toContain(value);
            expect(labels).toContain(value);
        });
    });

    it('should select formik value', () => {
        const RenderProps = shallow(<Tag {...props}/>)
            .dive()
            .props()
            .render;
        const cmp = shallow(<RenderProps field={{value: ['healthy']}}/>);

        expect(cmp.props().value).toEqual([{label: 'healthy', value: 'healthy'}]);
    });

    it('should set readOnly to true when fromdefinition is readOnly', () => {
        testReadOnly(true);
    });

    it('should set readOnly to false when fromdefinition is not readOnly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.formDefinition.readOnly = readOnly;
        const RenderProps = shallow(<Tag {...props}/>)
            .dive()
            .props()
            .render;
        const cmp = shallow(<RenderProps field={{}}/>);

        expect(cmp.props().readOnly).toEqual(readOnly);
    };
});
