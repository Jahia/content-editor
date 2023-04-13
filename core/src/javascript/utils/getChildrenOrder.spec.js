import {getChildrenOrder} from '~/utils';

describe('getChildrenOrder', () => {
    it('should not modify anything if there is no Children Order field', () => {
        expect(getChildrenOrder({})).toEqual({shouldModifyChildren: false, childrenOrder: []});
    });

    it('should not modify anything if there is no changes in Children Order field', () => {
        const formValue = {
            'Children::Order': [{name: 'ac'}, {name: 'dc'}]
        };
        const nodeData = {
            children: {
                nodes: [{name: 'ac'}, {name: 'dc'}]
            }
        };
        expect(getChildrenOrder(formValue, nodeData)).toEqual({shouldModifyChildren: false, childrenOrder: []});
    });

    it('should return the new children order, only names', () => {
        const formValue = {
            'Children::Order': [{name: 'dc'}, {name: 'ac'}]
        };
        const nodeData = {
            children: {
                nodes: [{name: 'ac'}, {name: 'dc'}]
            }
        };
        expect(getChildrenOrder(formValue, nodeData)).toEqual({
            shouldModifyChildren: true,
            childrenOrder: ['dc', 'ac']
        });
    });
});
