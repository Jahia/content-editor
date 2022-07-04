import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {PickerDialog} from './index';
import {setQueryResponseMock} from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock;
    return {
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});

describe('PickerDialog', () => {
    let props;
    beforeEach(() => {
        props = {
            isOpen: true,
            onItemSelection: jest.fn(),
            onClose: jest.fn(),
            initialSelectedItem: '',
            editorContext: {
                site: 'digitall',
                siteInfo: {
                    displayName: 'digitall'
                },
                lang: 'en',
                uilang: 'en'
            },
            id: 'id1',
            field: {},
            t: jest.fn(),
            pickerConfig: {
                displayTree: true,
                treeConfigs: [{
                    rootPath: '/rootPath/',
                    selectableTypes: [],
                    openableTypes: [],
                    getRootPath: jest.fn()
                }]
            }
        };
        setQueryResponseMock({
            data: {
                jcr: {
                    results: {
                        siteNodes: [
                            {
                                hasPermission: true,
                                displayName: 'A',
                                name: 'B'
                            },
                            {
                                hasPermission: true,
                                displayName: 'B',
                                name: 'B'
                            }
                        ]
                    }
                }
            }
        });
    });

    it('should close the Dialog when the props say so', () => {
        props.isOpen = false;
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(false);
    });

    it('should close the Dialog when trigger onCloseDialog', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.simulate('close');

        expect(props.onClose).toHaveBeenCalledWith();
    });

    it('should initialy select current system site', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('LeftPanel').props().site).toBe('digitall');
    });

    it('should not display the LeftPanel when displayTree is false', () => {
        props.pickerConfig.displayTree = false;
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('LeftPanel').exists()).toBe(false);
    });

    it('should display the LeftPanel when displayTree is true', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('LeftPanel').exists()).toBe(true);
    });
});
