import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {PickerDialog} from './index';

jest.mock('react-apollo-hooks', () => {
    let queryresponsemock;
    return {
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});
import {setQueryResponseMock} from 'react-apollo-hooks';

describe('PickerDialog', () => {
    let props;
    beforeEach(() => {
        props = {
            isOpen: true,
            setIsOpen: jest.fn(),
            initialSelectedItem: '',
            editorContext: {
                site: 'digitall'
            },
            id: 'id1',
            field: {},
            nodeTreeConfigs: [{
                rootPath: '/rootPath/',
                treeConfig: {
                    selectableTypes: [],
                    openableTypes: [],
                    rootPath: jest.fn()
                }
            }],
            t: jest.fn(),
            pickerConfig: {
                displayTree: true
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

        expect(props.setIsOpen).toHaveBeenCalledWith(false);
    });

    it('should initialy select current system site', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const FastFieldRender = cmp.find('FormikConnect(FastFieldInner)').props().render;
        const child = shallowWithTheme(
            <FastFieldRender form={{setFieldValue: jest.fn(), setFieldTouched: jest.fn()}}/>,
            {},
            dsGenericTheme
        );

        expect(child.find('LeftPanel').props().site).toBe('digitall');
    });

    it('should not display the LeftPanel when displayTree is false', () => {
        props.pickerConfig.displayTree = false;
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const FastFieldRender = cmp.find('FormikConnect(FastFieldInner)').props().render;
        const child = shallowWithTheme(
            <FastFieldRender form={{setFieldValue: jest.fn(), setFieldTouched: jest.fn()}}/>,
            {},
            dsGenericTheme
        );

        expect(child.find('LeftPanel').exists()).toBe(false);
    });

    it('should display the LeftPanel when displayTree is true', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        const FastFieldRender = cmp.find('FormikConnect(FastFieldInner)').props().render;
        const child = shallowWithTheme(
            <FastFieldRender form={{setFieldValue: jest.fn(), setFieldTouched: jest.fn()}}/>,
            {},
            dsGenericTheme
        );

        expect(child.find('LeftPanel').exists()).toBe(true);
    });
});
