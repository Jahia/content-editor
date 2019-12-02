import {adaptToCategoryTree} from './catergory.adapter';

describe('category adapter', () => {
    it('should return empty array when there is no nodes', () => {
        expect(adaptToCategoryTree({nodes: [], parent: {name: 'category'}})).toEqual([]);
    });

    it('should build a tree', () => {
        const parent = {name: 'category'};
        const nodes = [
            {name: 'A', parent: {name: 'category'}},
            {name: 'B', parent: {name: 'A'}},
            {name: 'orphan', parent: {name: 'Unkown'}},
            {name: 'C', parent: {name: 'B'}},
            {name: 'D', parent: {name: 'C'}},
            {name: 'E', parent: {name: 'C'}},
            {name: 'C2', parent: {name: 'B'}},
            {name: 'leaf', parent: {name: 'category'}}
        ];

        expect(adaptToCategoryTree({nodes, parent})).toEqual([
            {
                name: 'A',
                label: undefined,
                children: [
                    {
                        name: 'B',
                        label: undefined,
                        children: [
                            {
                                name: 'C',
                                label: undefined,
                                children: [
                                    {name: 'D', label: undefined, children: []},
                                    {name: 'E', label: undefined, children: []}
                                ]
                            },
                            {name: 'C2', label: undefined, children: []}
                        ]
                    }
                ]
            },
            {name: 'leaf', label: undefined, children: []}
        ]);
    });

    it('should build a tree with a label', () => {
        const parent = {name: 'category'};
        const nodes = [
            {name: 'A', displayName: 'hello', parent: {name: 'category'}},
            {name: 'B', displayName: 'world', parent: {name: 'A'}}
        ];

        expect(adaptToCategoryTree({nodes, parent})).toEqual([
            {name: 'A', label: 'hello', children: [{name: 'B', label: 'world', children: []}]}
        ]);
    });
});
