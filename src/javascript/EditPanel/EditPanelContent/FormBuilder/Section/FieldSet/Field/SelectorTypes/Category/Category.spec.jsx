import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import Category from './Category';
import {setQueryResult} from 'react-apollo-hooks';

jest.mock('react-apollo-hooks', () => {
    let queryResultmock;
    return {
        useQuery: jest.fn(() => {
            return {data: queryResultmock, error: null, loading: false};
        }),
        setQueryResult: r => {
            queryResultmock = r;
        }
    };
});

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

        setQueryResult({
            jcr: {
                result: {
                    descendants: {
                        nodes: []
                    }
                }
            }
        });
    });

    const handleChange = jest.fn();
    const fieldTouched = jest.fn();

    const buildComp = props => {
        const mainComponent = shallowWithTheme(<Category {...props}/>, {}, dsGenericTheme).dive();
        const RenderProps = mainComponent.props().render;
        return shallowWithTheme(<RenderProps form={{setFieldTouched: fieldTouched, setFieldValue: handleChange}}/>, {}, dsGenericTheme);
    };

    it('should bind the id properly', () => {
        const cmp = buildComp(props);
        expect(cmp.props().id).toBe(props.id);
    });
});
