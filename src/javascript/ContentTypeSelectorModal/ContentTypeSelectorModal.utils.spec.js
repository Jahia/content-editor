import {filterTree} from './ContentTypeSelectorModal.utils';

jest.mock('@jahia/moonstone');

describe('ContentTypeSelectorModal utils', () => {
    describe('filterTree', () => {
        let tree;
        let flatTree;
        let selectedType;
        beforeEach(() => {
            tree = [
                {
                    id: 'nt:base',
                    name: 'nt:base',
                    nodeType: {
                        mixin: false
                    },
                    children: [
                        {
                            name: 'hello',
                            label: 'world',
                            parent: {
                                id: 'nt:base'
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
            expect(result[0].id).toBe('nt:base');
            expect(result.length).toBe(1);
        });

        it('should also filter when filtering with name', () => {
            const result = filterTree(tree, selectedType, 'hello');
            expect(result[0].id).toBe('nt:base');
            expect(result.length).toBe(1);
        });

        it('should find both node when filtering with LO', () => {
            const result = filterTree(tree, selectedType, 'lo');
            expect(result.length).toBe(2);
            expect(result[0].id).toBe('nt:base');
            expect(result[1].id).toBe('id2');
        });

        it('should return nodeType when they are flatten', () => {
            const result = filterTree(flatTree);
            expect(result.length).toBe(2);
            expect(result[0].id).toBe('id1');
            expect(result[1].id).toBe('id2');
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
