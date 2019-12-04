import {adaptToCategoryTree} from './category.adapter';

describe('category adapter', () => {
    it('should return empty array when there is no nodes', () => {
        expect(adaptToCategoryTree({nodes: [], parent: {uuid: 'category'}})).toEqual([]);
    });

    it('should build a tree', () => {
        const parent = {uuid: 'category'};
        const nodes = [
            {uuid: 'A', parent: {uuid: 'category'}},
            {uuid: 'B', parent: {uuid: 'A'}},
            {uuid: 'orphan', parent: {uuid: 'Unkown'}},
            {uuid: 'C', parent: {uuid: 'B'}},
            {uuid: 'D', parent: {uuid: 'C'}},
            {uuid: 'E', parent: {uuid: 'C'}},
            {uuid: 'C2', parent: {uuid: 'B'}},
            {uuid: 'leaf', parent: {uuid: 'category'}}
        ];

        expect(adaptToCategoryTree({nodes, parent})).toEqual([
            {
                uuid: 'A',
                label: undefined,
                children: [
                    {
                        uuid: 'B',
                        label: undefined,
                        children: [
                            {
                                uuid: 'C',
                                label: undefined,
                                children: [
                                    {uuid: 'D', label: undefined, children: []},
                                    {uuid: 'E', label: undefined, children: []}
                                ]
                            },
                            {uuid: 'C2', label: undefined, children: []}
                        ]
                    }
                ]
            },
            {uuid: 'leaf', label: undefined, children: []}
        ]);
    });

    it('should build a tree with a label', () => {
        const parent = {uuid: 'category'};
        const nodes = [
            {uuid: 'A', displayName: 'hello', parent: {uuid: 'category'}},
            {uuid: 'B', displayName: 'world', parent: {uuid: 'A'}}
        ];

        expect(adaptToCategoryTree({nodes, parent})).toEqual([
            {uuid: 'A', label: 'hello', children: [{uuid: 'B', label: 'world', children: []}]}
        ]);
    });

    it('should set value checked when uuid correspond to the selectedValues', () => {
        const parent = {uuid: 'category'};
        const nodes = [
            {uuid: 'A', displayName: 'hello', parent: {uuid: 'category'}},
            {uuid: 'B', displayName: 'world', parent: {uuid: 'A'}},
            {uuid: 'C', displayName: 'C', parent: {uuid: 'category'}},
            {uuid: 'D', displayName: 'D', parent: {uuid: 'category'}}
        ];
        const selectedValues = ['B', 'C'];

        expect(adaptToCategoryTree({nodes, parent, selectedValues})).toEqual([
            {uuid: 'A', label: 'hello', checked: false, children: [{uuid: 'B', label: 'world', checked: true, children: []}]},
            {uuid: 'C', label: 'C', checked: true, children: []},
            {uuid: 'D', label: 'D', checked: false, children: []}
        ]);
    });
});
