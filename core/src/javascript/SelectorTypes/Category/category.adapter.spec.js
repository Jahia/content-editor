import {adaptToCategoryTree} from './category.adapter';

describe('category adapter', () => {
    let nodes;
    beforeEach(() => {
        nodes = [
            {uuid: 'A', value: 'A', label: 'aa', parent: {uuid: 'category'}},
            {uuid: 'B', value: 'B', label: 'bb', parent: {uuid: 'A'}},
            {uuid: 'orphan', value: 'orphan', label: 'orphan', parent: {uuid: 'Unkown'}},
            {uuid: 'C', value: 'C', label: 'cc', parent: {uuid: 'B'}},
            {uuid: 'D', value: 'D', label: 'dd', parent: {uuid: 'C'}},
            {uuid: 'E', value: 'E', label: 'ee', parent: {uuid: 'C'}},
            {uuid: 'E', value: 'E', label: 'ee', parent: {uuid: 'C'}},
            {uuid: 'C2', value: 'C2', label: 'cc1', parent: {uuid: 'B'}},
            {uuid: 'leaf', value: 'leaf', label: 'leaf', parent: {uuid: 'category'}}
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
                id: 'A',
                value: 'A',
                label: 'aa',
                expanded: false,
                children: [{
                    id: 'B',
                    value: 'B',
                    label: 'bb',
                    expanded: false,
                    children: [{
                        id: 'C',
                        value: 'C',
                        label: 'cc',
                        expanded: false,
                        children: [{
                            id: 'D',
                            value: 'D',
                            label: 'dd',
                            expanded: false,
                            children: []
                        }, {
                            id: 'E',
                            value: 'E',
                            label: 'ee',
                            expanded: false,
                            children: []
                        }, {
                            id: 'E',
                            value: 'E',
                            label: 'ee',
                            expanded: false,
                            children: []
                        }]
                    }, {
                        id: 'C2',
                        value: 'C2',
                        label: 'cc1',
                        expanded: false,
                        children: []
                    }]
                }]
            }, {
                id: 'leaf',
                value: 'leaf',
                label: 'leaf',
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
                id: 'A',
                value: 'A',
                label: 'aa',
                expanded: true,
                checked: false,
                children: [{
                    id: 'B',
                    value: 'B',
                    label: 'bb',
                    expanded: true,
                    checked: true,
                    children: [{
                        id: 'C',
                        value: 'C',
                        label: 'cc',
                        expanded: false,
                        checked: true,
                        children: [{
                            id: 'D',
                            value: 'D',
                            label: 'dd',
                            expanded: false,
                            checked: false,
                            children: []
                        }, {
                            id: 'E',
                            value: 'E',
                            label: 'ee',
                            expanded: false,
                            checked: false,
                            children: []
                        }, {
                            id: 'E',
                            value: 'E',
                            label: 'ee',
                            expanded: false,
                            checked: false,
                            children: []
                        }]
                    }, {
                        id: 'C2',
                        value: 'C2',
                        label: 'cc1',
                        expanded: false,
                        checked: false,
                        children: []
                    }]
                }]
            }, {
                id: 'leaf',
                value: 'leaf',
                label: 'leaf',
                expanded: false,
                checked: false,
                children: []
            }
        ]);
    });
});
