import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import Category from './Category';

describe('Category component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'Category',
            field: {
                displayName: 'Categories',
                name: 'myCategories',
                readOnly: false,
                selectorType: 'Category'
            },
            classes: {}
        };
    });

    const handleChange = jest.fn();
    const fieldTouched = jest.fn();

    const buildComp = props => {
        const mainComponent = shallowWithTheme(<Category {...props}/>, {}, dsGenericTheme);
        const RenderProps = mainComponent.props().render;
        return shallowWithTheme(<RenderProps form={{setFieldTouched: fieldTouched, setFieldValue: handleChange}}/>, {}, dsGenericTheme);
    };

    it('should bind the id properly', () => {
        const cmp = buildComp(props);
        expect(cmp.props().id).toBe(props.id);
    });
});
