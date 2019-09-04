import {useTreeOfNewContent} from './CreateNewContent.adapter';
import {defineUseQueryResponse} from 'react-apollo-hooks';

jest.mock('react-apollo-hooks', () => {
    let useQueryMock;
    return {
        useQuery: () => {
            return useQueryMock;
        },
        defineUseQueryResponse: d => {
            useQueryMock = d;
        }
    };
});

describe('useTreeOfNewContent', () => {
    let queryResponse;
    beforeEach(() => {
        queryResponse = {
            data: {
                jcr: {
                    base: {
                        name: 'baseCategoryName',
                        displayName: 'baseCategoryName:',
                        icon: 'basecatimg'
                    },
                    nodeTypeByName: {
                        subTypes: {
                            nodes: [
                                {
                                    name: 'base',
                                    displayName: 'base:',
                                    icon: 'baseimg',
                                    supertypes: [
                                        {
                                            mixin: true,
                                            isNodeType: true,
                                            name: 'categoryName',
                                            displayName: 'categoryName:',
                                            icon: 'catimg'
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        };
    });

    it('should return loading at true', () => {
        defineUseQueryResponse({loading: true});
        expect(useTreeOfNewContent().loading).toBe(true);
    });

    it('should return error when there is one', () => {
        const error = new Error('toto');
        defineUseQueryResponse({error});
        expect(useTreeOfNewContent().error).toBe(error);
    });

    it('should return an empty tree when no nodes is returned', () => {
        queryResponse.data.jcr.nodeTypeByName.subTypes.nodes = [];
        defineUseQueryResponse(queryResponse);

        expect(useTreeOfNewContent().tree).toEqual([]);
    });

    it('should return an tree with one category', () => {
        defineUseQueryResponse(queryResponse);

        expect(useTreeOfNewContent().tree.length).toBe(1);
    });

    it('should return an tree with one category named categoryName', () => {
        defineUseQueryResponse(queryResponse);

        expect(useTreeOfNewContent().tree[0].id).toBe('categoryName');
        expect(useTreeOfNewContent().tree[0].label).toBe('categoryName:');
    });

    it('should return an tree with one category and one content named base', () => {
        defineUseQueryResponse(queryResponse);

        expect(useTreeOfNewContent().tree[0].childs.length).toBe(1);

        expect(useTreeOfNewContent().tree[0].childs[0].id).toBe('base');
        expect(useTreeOfNewContent().tree[0].childs[0].label).toBe('base:');
    });

    it('should return add content to base when category is not suitable in supertypes', () => {
        queryResponse.data.jcr.nodeTypeByName.subTypes.nodes[0].supertypes[0].mixin = false;
        defineUseQueryResponse(queryResponse);

        expect(useTreeOfNewContent().tree.length).toBe(1);

        expect(useTreeOfNewContent().tree[0].id).toBe('baseCategoryName');
        expect(useTreeOfNewContent().tree[0].label).toBe('baseCategoryName:');
    });
});
