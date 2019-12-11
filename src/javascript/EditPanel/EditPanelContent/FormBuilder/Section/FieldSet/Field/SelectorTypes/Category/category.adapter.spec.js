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
                value: 'A',
                label: undefined,
                children: [
                    {
                        value: 'B',
                        label: undefined,
                        children: [
                            {
                                value: 'C',
                                label: undefined,
                                children: [
                                    {value: 'D', label: undefined, children: []},
                                    {value: 'E', label: undefined, children: []}
                                ]
                            },
                            {value: 'C2', label: undefined, children: []}
                        ]
                    }
                ]
            },
            {value: 'leaf', label: undefined, children: []}
        ]);
    });

    it('should build a tree with a label', () => {
        const parent = {uuid: 'category'};
        const nodes = [
            {uuid: 'A', displayName: 'hello', parent: {uuid: 'category'}},
            {uuid: 'B', displayName: 'world', parent: {uuid: 'A'}}
        ];

        expect(adaptToCategoryTree({nodes, parent})).toEqual([
            {value: 'A', label: 'hello', children: [{value: 'B', label: 'world', children: []}]}
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
            {value: 'A', label: 'hello', checked: false, children: [{value: 'B', label: 'world', checked: true, children: []}]},
            {value: 'C', label: 'C', checked: true, children: []},
            {value: 'D', label: 'D', checked: false, children: []}
        ]);
    });
});
