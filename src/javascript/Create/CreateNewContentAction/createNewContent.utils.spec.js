import {getActions, filterTree} from './createNewContent.utits';

describe('CreateNewContent utils', () => {
    describe('getActions', () => {
        let context;
        let queryResponse;

        beforeEach(() => {
            context = {
                client: {
                    query: jest.fn(() => Promise.resolve(queryResponse))
                }
            };

            queryResponse = {
                data: {
                    forms: {
                        contentTypesAsTree: [
                            {
                                name: 'parent',
                                children: [
                                    {name: 'toto'},
                                    {name: 'tete'}
                                ]
                            },
                            {
                                name: 'tata',
                                children: []
                            }
                        ]
                    }
                }
            };
        });

        it('should make a query', async () => {
            await getActions(context);

            expect(context.client.query).toHaveBeenCalled();
        });

        it('should return empty array when no contentTypesAsTree is returned', async () => {
            queryResponse.data.forms.contentTypesAsTree = [];
            expect(await getActions(context)).toEqual([]);
        });

        it('should return null when there is more than 5 nodeTypes', async () => {
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'yolo'
            });
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'yola'
            });
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'yole'
            });
            expect(await getActions(context)).toEqual(undefined);
        });

        it('should return actions', async () => {
            const actions = await getActions(context);
            expect(actions[0].key).toEqual('toto-beta');
            expect(actions[1].key).toEqual('tete-beta');
            expect(actions[2].key).toEqual('tata-beta');
            expect(actions.length).toBe(3);
        });

        it('should return actions without jnt:resource', async () => {
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'jnt:resource'
            });

            const actions = await getActions(context);
            expect(actions[0].key).toEqual('toto-beta');
            expect(actions[1].key).toEqual('tete-beta');
            expect(actions[2].key).toEqual('tata-beta');
            expect(actions.length).toBe(3);
        });
    });

    describe('filterTree', () => {
        let tree;
        let flatTree;
        let selectedType;
        beforeEach(() => {
            tree = [
                {
                    id: 'id1',
                    nodeType: {
                        mixin: true
                    },
                    children: [
                        {
                            name: 'hello',
                            label: 'world',
                            parent: {
                                id: 'id1'
                            }
                        }
                    ]
                },
                {
                    id: 'id2',
                    nodeType: {
                        mixin: true
                    },
                    children: [
                        {
                            name: 'logarithm',
                            label: 'logarithmiks',
                            parent: {
                                id: 'id2'
                            }
                        }
                    ]
                }
            ];
            flatTree = [
                {
                    id: 'id1',
                    name: 'hello',
                    label: 'pere',
                    nodeType: {
                        mixin: false
                    },
                    children: []
                },
                {
                    id: 'id2',
                    name: 'world',
                    label: 'noel',
                    nodeType: {
                        mixin: false
                    },
                    children: []
                }
            ];
            selectedType = tree[0].children[0];
        });

        it('should return empty array when sending empty tree', () => {
            expect(filterTree([])).toEqual([]);
        });

        it('should select first value when filter with world', () => {
            const result = filterTree(tree, selectedType, 'world');
            expect(result[0].id).toBe('id1');
            expect(result.length).toBe(1);
        });

        it('should open parent category when filter', () => {
            const result = filterTree(tree, selectedType, 'world');
            expect(result[0].opened).toEqual(true);
        });

        it('should select children when selectedType say so', () => {
            const result = filterTree(tree, selectedType, 'world');
            expect(result[0].children[0].selected).toEqual(true);
        });

        it('should also filter when filtering with name', () => {
            const result = filterTree(tree, selectedType, 'hello');
            expect(result[0].id).toBe('id1');
            expect(result.length).toBe(1);
        });

        it('should find both node when filtering with LO', () => {
            const result = filterTree(tree, selectedType, 'lo');
            expect(result.length).toBe(2);
            expect(result[0].id).toBe('id1');
            expect(result[1].id).toBe('id2');
        });

        it('should return nodeType when they are flatten', () => {
            const result = filterTree(flatTree);
            expect(result.length).toBe(2);
            expect(result[0].id).toBe('id1');
            expect(result[1].id).toBe('id2');
        });

        it('should select flattend nodeType when selectedType say so', () => {
            const result = filterTree(flatTree, flatTree[0]);
            expect(result[0].selected).toEqual(true);
        });

        it('should filter flattend nodeType when filter', () => {
            const result = filterTree(flatTree, flatTree[0], 'world');
            expect(result.length).toEqual(1);
            expect(result[0].id).toEqual('id2');
        });

        it('should remove empty category', () => {
            tree.push({
                id: 'id3',
                nodeType: {
                    mixin: true
                },
                children: []
            });

            const result = filterTree(tree, selectedType);
            expect(result.length).toBe(2);
        });
    });
});
