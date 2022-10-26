import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {ContentTypeSelectorModal} from './ContentTypeSelectorModal';

jest.mock('@jahia/moonstone');

const tree = [
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

const emptyTree = [];

describe('CreateNewContentDialog', () => {
    let props;
    beforeEach(() => {
        console.error = jest.fn();
        props = {
            parentPath: '',
            onClose: jest.fn(),
            onExited: jest.fn(),
            onCreateContent: jest.fn()
        };
    });

    it('should display the dialog by default', () => {
        const cmp = shallowWithTheme(
            <ContentTypeSelectorModal nodeTypesTree={emptyTree} {...props} open/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('should close the dialog when click on the cancel button', () => {
        let open = true;
        const cmp = shallowWithTheme(
            <ContentTypeSelectorModal {...props}
                                      nodeTypesTree={emptyTree}
                                      open={open}
                                      onClose={() => {
                                        open = false;
                                    }}
                                      onExited={() => {
                                        open = false;
                                    }}/>,
            {},
            dsGenericTheme
        );

        cmp.find('Button').at(0).simulate('click');

        expect(open).toBe(false);
    });

    it('should call onCreateContent when clicking on create button Button', () => {
        const cmp = shallowWithTheme(
            <ContentTypeSelectorModal open nodeTypesTree={emptyTree} {...props}/>,
            {},
            dsGenericTheme
        );

        cmp.find('Button').at(1).simulate('click');

        expect(props.onCreateContent).toHaveBeenCalledWith(null);
    });

    it('should filter properly with id hichem', () => {
        const cmp = shallowWithTheme(
            <ContentTypeSelectorModal open nodeTypesTree={tree} {...props}/>,
            {},
            dsGenericTheme
        );

        cmp.find('Input').simulate('change', {target: {value: 'Rom3'}});

        expect(cmp.find('TreeView').props().data[0].id).toBe('catB');
        expect(cmp.find('TreeView').props().data.length).toBe(1);
    });

    it('should filter properly with id rom3 with no case sensitive', () => {
        const cmp = shallowWithTheme(
            <ContentTypeSelectorModal open nodeTypesTree={tree} {...props}/>,
            {},
            dsGenericTheme
        );

        cmp.find('Input').simulate('change', {target: {value: 'rom3'}});

        expect(cmp.find('TreeView').props().data[0].id).toBe('catB');
        expect(cmp.find('TreeView').props().data.length).toBe(1);
    });

    it('should filter properly with n with no case sensitive', () => {
        const cmp = shallowWithTheme(
            <ContentTypeSelectorModal open nodeTypesTree={tree} {...props}/>,
            {},
            dsGenericTheme
        );

        cmp.find('Input').simulate('change', {target: {value: 'n'}});

        expect(cmp.find('TreeView').props().data.length).toBe(2);

        expect(cmp.find('TreeView').props().data[0].children.length).toBe(3);
        expect(cmp.find('TreeView').props().data[0].children[0].id).toBe('dan1');
        expect(cmp.find('TreeView').props().data[0].children[1].id).toBe('dan2');
        expect(cmp.find('TreeView').props().data[0].children[2].id).toBe('dan3');

        expect(cmp.find('TreeView').props().data[1].children.length).toBe(2);
        expect(cmp.find('TreeView').props().data[1].children[0].id).toBe('rom1');
        expect(cmp.find('TreeView').props().data[1].children[1].id).toBe('rom2');
    });
});
