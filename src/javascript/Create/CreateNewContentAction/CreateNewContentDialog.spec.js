import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {CreateNewContentDialog} from './CreateNewContentDialog';
import {setResponseMock} from '@apollo/react-hooks';

jest.mock('react-apollo', () => ({
    withApollo: Cmp => props => (<Cmp {...props} client={{}}/>),
    compose: jest.requireActual('react-apollo').compose
}));

jest.mock('@apollo/react-hooks', () => {
    let responsemock;
    return {
        useQuery: () => responsemock,
        setResponseMock: m => {
            responsemock = m;
        }
    };
});

describe('CreateNewContentDialog', () => {
    let tree;
    let emptyTree;
    let props;
    beforeEach(() => {
        console.error = jest.fn();
        const result = [
            {
                id: 'catA',
                name: 'catA',
                label: 'category A',
                nodeType: {
                    mixin: true
                },
                children: [
                    {id: 'dan1', name: 'dan1', label: 'daniela'},
                    {id: 'dan2', name: 'dan2', label: 'daniel'},
                    {id: 'dan3', name: 'dan3', label: 'danie'}
                ]
            },
            {
                id: 'catB',
                name: 'catB',
                label: 'category B',
                nodeType: {
                    mixin: true
                },
                children: [
                    {id: 'rom1', name: 'rom1', label: 'Romain'},
                    {id: 'rom2', name: 'rom2', label: 'romain'},
                    {id: 'Rom3', name: 'Rom3', label: 'hichem'}
                ]
            }
        ];

        emptyTree = {data: {forms: {contentTypesAsTree: []}}};

        tree = {data: {forms: {contentTypesAsTree: result}}};

        props = {
            parentPath: '',
            onClose: jest.fn(),
            onExited: jest.fn(),
            onCreateContent: jest.fn()
        };
    });

    it('should display the dialog by default', () => {
        setResponseMock(emptyTree);

        const cmp = shallowWithTheme(
            <CreateNewContentDialog {...props} open/>,
            {},
            dsGenericTheme
        ).dive().dive();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('should close the dialog when click on the cancel button', () => {
        setResponseMock(emptyTree);

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
        ).dive().dive();

        cmp.find('Button').at(0).simulate('click');

        expect(open).toBe(false);
    });

    it('should call onCreateContent when clicking on create button Button', () => {
        setResponseMock(emptyTree);

        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive();

        cmp.find('Button').at(1).simulate('click');

        expect(props.onCreateContent).toHaveBeenCalledWith(null);
    });

    it('should show error when crashing', () => {
        setResponseMock({error: new Error('oops')});

        expect(() => shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive()).toThrowError('oops');
    });

    it('should filter properly with id hichem', () => {
        setResponseMock(tree);
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive();

        cmp.find('Input').simulate('change', {target: {value: 'Rom3'}});

        expect(cmp.find('TreeView').props().tree[0].id).toBe('catB');
        expect(cmp.find('TreeView').props().tree.length).toBe(1);
    });

    it('should filter properly with id rom3 with no case sensitive', () => {
        setResponseMock(tree);
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive();

        cmp.find('Input').simulate('change', {target: {value: 'rom3'}});

        expect(cmp.find('TreeView').props().tree[0].id).toBe('catB');
        expect(cmp.find('TreeView').props().tree.length).toBe(1);
    });

    it('should filter properly with n with no case sensitive', () => {
        setResponseMock(tree);
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open {...props}/>,
            {},
            dsGenericTheme
        ).dive().dive();

        cmp.find('Input').simulate('change', {target: {value: 'n'}});

        expect(cmp.find('TreeView').props().tree.length).toBe(2);

        expect(cmp.find('TreeView').props().tree[0].children.length).toBe(3);
        expect(cmp.find('TreeView').props().tree[0].children[0].id).toBe('dan1');
        expect(cmp.find('TreeView').props().tree[0].children[1].id).toBe('dan2');
        expect(cmp.find('TreeView').props().tree[0].children[2].id).toBe('dan3');

        expect(cmp.find('TreeView').props().tree[1].children.length).toBe(2);
        expect(cmp.find('TreeView').props().tree[1].children[0].id).toBe('rom1');
        expect(cmp.find('TreeView').props().tree[1].children[1].id).toBe('rom2');
    });
});
