import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {CreateNewContentDialog} from './CreateNewContentDialog';

jest.mock('react-apollo', () => ({
    withApollo: Cmp => props => (<Cmp {...props} client={{}}/>),
    compose: jest.requireActual('react-apollo').compose
}));

jest.mock('./CreateNewContent.adapter', () => {
    let responsemock;
    return {
        useTreeOfNewContent: () => responsemock,
        setResponseMock: m => {
            responsemock = m;
        }
    };
});
import {setResponseMock} from './CreateNewContent.adapter';

describe('CreateNewContentDialog', () => {
    let tree;
    let props;
    beforeEach(() => {
        console.error = jest.fn();
        tree = [
            {
                id: 'catA',
                label: 'category A',
                childs: [
                    {id: 'dan1', label: 'daniela'},
                    {id: 'dan2', label: 'daniel'},
                    {id: 'dan3', label: 'danie'}
                ]
            },
            {
                id: 'catB',
                label: 'category B',
                childs: [
                    {id: 'rom1', label: 'Romain'},
                    {id: 'rom2', label: 'romain'},
                    {id: 'Rom3', label: 'hitler'}
                ]
            }
        ];

        props = {
            onClose: jest.fn(),
            onExited: jest.fn(),
            onCreateContent: jest.fn()
        };
    });

    it('should display the dialog by default', () => {
        setResponseMock({tree: []});

        const cmp = shallowWithTheme(
            <CreateNewContentDialog {...props} open/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('should close the dialog when click on the cancel button', () => {
        setResponseMock({tree: []});

        let open = true;
        const cmp = shallowWithTheme(
            <CreateNewContentDialog {...props}
                                    open={open}
                                    onClose={() => {
                                        open = false;
                                    }}
                                    onExited={() => {
                                        open = false;
                                    }}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        cmp.find('DsButton').at(0).simulate('click');

        expect(open).toBe(false);
    });

    it('should call onCreateContent when clicking on create button Button', () => {
        setResponseMock({tree: []});

        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        cmp.find('DsButton').at(1).simulate('click');

        expect(props.onCreateContent).toHaveBeenCalledWith(null);
    });

    it('should show error when crashing', () => {
        setResponseMock({error: new Error('oops')});

        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        expect(cmp.debug()).toContain('oops');
    });

    it('should filter properly with id hitler', () => {
        setResponseMock({tree});
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        cmp.find('Input').simulate('change', {target: {value: 'Rom3'}});

        expect(cmp.find('TreeView').props().tree[0].id).toBe('catB');
        expect(cmp.find('TreeView').props().tree.length).toBe(1);
    });

    it('should filter properly with id rom3 with no case sensitive', () => {
        setResponseMock({tree});
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        cmp.find('Input').simulate('change', {target: {value: 'rom3'}});

        expect(cmp.find('TreeView').props().tree[0].id).toBe('catB');
        expect(cmp.find('TreeView').props().tree.length).toBe(1);
    });

    it('should filter properly with n with no case sensitive', () => {
        setResponseMock({tree});
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        cmp.find('Input').simulate('change', {target: {value: 'n'}});

        expect(cmp.find('TreeView').props().tree.length).toBe(2);

        expect(cmp.find('TreeView').props().tree[0].childs.length).toBe(3);
        expect(cmp.find('TreeView').props().tree[0].childs[0].id).toBe('dan1');
        expect(cmp.find('TreeView').props().tree[0].childs[1].id).toBe('dan2');
        expect(cmp.find('TreeView').props().tree[0].childs[2].id).toBe('dan3');

        expect(cmp.find('TreeView').props().tree[1].childs.length).toBe(2);
        expect(cmp.find('TreeView').props().tree[1].childs[0].id).toBe('rom1');
        expect(cmp.find('TreeView').props().tree[1].childs[1].id).toBe('rom2');
    });
});
