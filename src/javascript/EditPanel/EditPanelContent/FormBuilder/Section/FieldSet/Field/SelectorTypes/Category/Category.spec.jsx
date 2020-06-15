import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import Category from './Category';
import {setQueryResult} from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => {
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
    const onChange = jest.fn();
    const onInit = jest.fn();

    beforeEach(() => {
        props = {
            onChange,
            onInit,
            id: 'Category',
            field: {
                displayName: 'Categories',
                name: 'myCategories',
                readOnly: false,
                selectorType: 'Category'
            },
            editorContext: {
                lang: 'en'
            },
            classes: {}
        };

        setQueryResult({
            jcr: {
                result: {
                    descendants: {
                        nodes: [
                            {
                                uuid: 'A',
                                parent: {
                                    uuid: 'root'
                                }
                            },
                            {
                                uuid: 'BG',
                                parent: {
                                    uuid: 'root'
                                }
                            },
                            {
                                uuid: 'Gauche',
                                parent: {
                                    uuid: 'root'
                                }
                            }
                        ]
                    }
                }
            }
        });
    });

    const buildComp = props => {
        return shallowWithTheme(<Category {...props}/>, {}, dsGenericTheme);
    };

    it('should bind the id properly', () => {
        const cmp = buildComp(props);
        expect(cmp.props().id).toBe(props.id);
    });

    it('should onInit called when render the element', () => {
        buildComp(props);
        expect(onInit).toHaveBeenCalled();
    });

    it('should onChange called when modify an element', () => {
        const cmp = buildComp(props);
        cmp.simulate('change', null, [{value: 'A'}, {value: 'Gauche'}]);
        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls[0][0]).toStrictEqual(['A', 'Gauche']);
        expect(onChange.mock.calls[0][1](onChange.mock.calls[0][0])).toStrictEqual([
            {
                uuid: 'A',
                parent: {
                    uuid: 'root'
                }
            },
            {
                uuid: 'Gauche',
                parent: {
                    uuid: 'root'
                }
            }
        ]);
        expect(onChange.mock.calls[0][2](onChange.mock.calls[0][0])).toStrictEqual([
            {
                uuid: 'A',
                parent: {
                    uuid: 'root'
                }
            },
            {
                uuid: 'Gauche',
                parent: {
                    uuid: 'root'
                }
            }
        ]);
    });
});
