import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {TreeView} from './TreeView';

describe('TreeView', () => {
    let props;
    beforeEach(() => {
        props = {
            tree: [
                {id: 'A',
                    label: 'A level1',
                    iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
                    childs: [
                        {id: 'A1', label: 'A-1 level2', iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'},
                        {id: 'A2', label: 'A-2 level2'},
                        {id: 'A3', label: 'A-3 level2'},
                        {id: 'A4', label: 'A-4 level2'}
                    ]
                },
                {id: 'B',
                    label: 'B level1',
                    iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
                    childs: [
                        {id: 'B1', label: 'B-1 level2'},
                        {id: 'B2', label: 'B-2 level2'},
                        {id: 'B3', label: 'B-3 level2'},
                        {id: 'B4', label: 'B-4 level2', childs: [
                            {id: 'B11', label: 'B-1-1 level3'},
                            {id: 'B22', label: 'B-2-2 level3', iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'},
                            {id: 'B33', label: 'B-3-3 level3'},
                            {id: 'B44', label: 'B-4-4 level3'}
                        ]}
                    ]
                },
                {
                    id: 'C',
                    label: 'C level1',
                    iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
                    childs: []
                },
                {
                    id: 'D',
                    label: 'D level1',
                    iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'
                }
            ],
            onNodeClick: jest.fn(),
            onNodeDoubleClick: jest.fn()
        };
    });

    it('should display each 1st level labels', () => {
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const html = cmp.debug();
        props.tree.forEach(node => {
            expect(html).toContain(node.label);
        });
    });

    it('should display a button when there is child', () => {
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('button').at(0).debug()).toContain(props.tree[0].label);
    });

    it('should display a button when there is child', () => {
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('button').at(2).exists()).toBe(false);
        expect(cmp.find('button').at(3).exists()).toBe(false);
    });

    it('should trigger a second level of a node when it\'s opened', () => {
        props.tree[0].opened = true;
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('button').at(0).simulate('click', {toto: 42});

        expect(props.onNodeClick).toHaveBeenCalledWith(props.tree[0], {toto: 42});
    });

    it('should trigger onNodeDoubleClick event when double click on a node', () => {
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('button').at(0).simulate('doubleClick', {toto: 42});

        expect(props.onNodeDoubleClick).toHaveBeenCalledWith(props.tree[0], {toto: 42});
    });

    it('should display a second level of a node when it\'s opened', () => {
        props.tree[0].opened = true;
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const html = cmp.debug();
        props.tree[0].childs.forEach(node => {
            expect(html).toContain(node.label);
        });
    });

    it('should not display a second level of a node when it\'s opened', () => {
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const html = cmp.debug();
        props.tree[0].childs.forEach(node => {
            expect(html).not.toContain(node.label);
        });
    });

    it('should not display a third level of a node when it\'s not opened', () => {
        props.tree[1].opened = true;
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const html = cmp.debug();
        props.tree[1].childs[3].childs.forEach(node => {
            expect(html).not.toContain(node.label);
        });
    });

    it('should display a third level of a node when it\'s opened', () => {
        props.tree[1].opened = true;
        props.tree[1].childs[3].opened = true;
        const cmp = shallowWithTheme(
            <TreeView {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const html = cmp.debug();
        props.tree[1].childs[3].childs.forEach(node => {
            expect(html).toContain(node.label);
        });
    });
});
