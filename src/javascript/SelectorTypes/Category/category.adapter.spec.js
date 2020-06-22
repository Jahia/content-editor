import {adaptToCategoryTree} from './category.adapter';

describe('category adapter', () => {
    let nodes;
    beforeEach(() => {
        nodes = [
            {uuid: 'A', label: 'aa', parent: {uuid: 'category'}},
            {uuid: 'B', label: 'bb', parent: {uuid: 'A'}},
            {uuid: 'orphan', label: 'orphan', parent: {uuid: 'Unkown'}},
            {uuid: 'C', label: 'cc', parent: {uuid: 'B'}},
            {uuid: 'D', label: 'dd', parent: {uuid: 'C'}},
            {uuid: 'E', label: 'ee', parent: {uuid: 'C'}},
            {uuid: 'C2', label: 'cc1', parent: {uuid: 'B'}},
            {uuid: 'leaf', label: 'leaf', parent: {uuid: 'category'}}
        ];
    });

    it('should return empty array when there is no nodes', () => {
        expect(adaptToCategoryTree({nodes: [], parent: {uuid: 'category'}})).toEqual([]);
    });

    it('should build a tree', () => {
        const parent = {uuid: 'category'};
        const tree = adaptToCategoryTree({nodes, parent});

        expect(tree).toEqual([
            {
                uuid: 'A',
                label: 'aa',
                parent: {
                    uuid: 'category'
                },
                expanded: false,
                children: [
                    {
                        uuid: 'B',
                        label: 'bb',
                        parent: {
                            uuid: 'A'
                        },
                        expanded: false,
                        children: [
                            {
                                uuid: 'C',
                                label: 'cc',
                                parent: {
                                    uuid: 'B'
                                },
                                expanded: false,
                                children: [
                                    {
                                        uuid: 'D',
                                        label: 'dd',
                                        parent: {
                                            uuid: 'C'
                                        },
                                        expanded: false,
                                        children: []
                                    },
                                    {
                                        uuid: 'E',
                                        label: 'ee',
                                        parent: {
                                            uuid: 'C'
                                        },
                                        expanded: false,
                                        children: []
                                    }
                                ]
                            },
                            {
                                uuid: 'C2',
                                label: 'cc1',
                                parent: {
                                    uuid: 'B'
                                },
                                expanded: false,
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                uuid: 'leaf',
                label: 'leaf',
                parent: {
                    uuid: 'category'
                },
                expanded: false,
                children: []
            }
        ]);
    });

    it('should set value checked when uuid correspond to the selectedValues', () => {
        const parent = {uuid: 'category'};
        const selectedValues = ['B', 'C'];

        expect(adaptToCategoryTree({nodes, parent, selectedValues})).toEqual([
            {
                uuid: 'A',
                label: 'aa',
                checked: false,
                parent: {
                    uuid: 'category'
                },
                expanded: true,
                children: [
                    {
                        uuid: 'B',
                        label: 'bb',
                        checked: true,
                        parent: {
                            uuid: 'A'
                        },
                        expanded: true,
                        children: [
                            {
                                uuid: 'C',
                                label: 'cc',
                                checked: true,
                                parent: {
                                    uuid: 'B'
                                },
                                expanded: false,
                                children: [
                                    {
                                        uuid: 'D',
                                        label: 'dd',
                                        checked: false,
                                        parent: {
                                            uuid: 'C'
                                        },
                                        expanded: false,
                                        children: []
                                    },
                                    {
                                        uuid: 'E',
                                        label: 'ee',
                                        checked: false,
                                        parent: {
                                            uuid: 'C'
                                        },
                                        expanded: false,
                                        children: []
                                    }
                                ]
                            },
                            {
                                uuid: 'C2',
                                label: 'cc1',
                                checked: false,
                                parent: {
                                    uuid: 'B'
                                },
                                expanded: false,
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                uuid: 'leaf',
                label: 'leaf',
                checked: false,
                parent: {
                    uuid: 'category'
                },
                expanded: false,
                children: []
            }
        ]);
    });
});
