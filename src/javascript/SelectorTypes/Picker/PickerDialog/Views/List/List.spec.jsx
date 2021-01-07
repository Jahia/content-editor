import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {t} from 'react-i18next';

jest.mock('@apollo/react-hooks', () => {
    let queryResultmock;
    return {
        useQuery: jest.fn(() => {
            return {data: queryResultmock, error: null, loading: false};
        }),
        setQueryResult: r => {
            queryResultmock = r;
        }
    };
});

import {setQueryResult, useQuery} from '@apollo/react-hooks';
import {List} from './List';

const queryResult = {
    descendants: {
        pageInfo: {
            totalCount: 10,
            __typename: 'PageInfo'
        },
        nodes: [{
            displayName: 'Home',
            isDisplayableNode: true,
            isNodeType: true,
            primaryNodeType: {
                typeName: 'Page',
                icon: '/jahia/modules/assets/icons/jnt_page',
                __typename: 'JCRNodeType'
            },
            createdBy: {value: 'system', __typename: 'JCRProperty'},
            lastModified: {value: '2019-05-23T14:05:22.674+02:00', __typename: 'JCRProperty'},
            uuid: 'bfb3bf41-8204-471f-bba7-98e93dcb8bb1',
            workspace: 'EDIT',
            path: '/sites/mySite/home',
            __typename: 'GenericJCRNode'
        }],
        __typename: 'JCRNodeConnection'
    }
};

const queryResultWithChildren = {
    retrieveTotalCount: {
        pageInfo: {
            totalCount: 10
        }
    },
    descendants: {
        pageInfo: {
            totalCount: 1,
            __typename: 'PageInfo'
        },
        nodes: [{
            displayName: 'Home',
            isDisplayableNode: false,
            isNodeType: true,
            primaryNodeType: {
                typeName: 'Page',
                icon: '/jahia/modules/assets/icons/jnt_page',
                __typename: 'JCRNodeType'
            },
            descendants: {
                pageInfo: {
                    totalCount: 8
                }
            },
            children: {
                pageInfo: {
                    totalCount: 5
                }
            },
            createdBy: {value: 'system', __typename: 'JCRProperty'},
            lastModified: {value: '2019-05-23T14:05:22.674+02:00', __typename: 'JCRProperty'},
            uuid: 'bfb3bf41-8204-471f-bba7-98e93dcb8bb1',
            workspace: 'EDIT',
            path: '/sites/mySite/home'
        }, {
            displayName: 'Home',
            isDisplayableNode: true,
            isNodeType: true,
            primaryNodeType: {
                typeName: 'Page',
                icon: '/jahia/modules/assets/icons/jnt_page',
                __typename: 'JCRNodeType'
            },
            descendants: {
                pageInfo: {
                    totalCount: 0
                }
            },
            children: {
                pageInfo: {
                    totalCount: 0
                }
            },
            createdBy: {value: 'system', __typename: 'JCRProperty'},
            lastModified: {value: '2019-05-23T14:05:22.674+02:00', __typename: 'JCRProperty'},
            uuid: 'bfb3bf41-8204-471f-bba7-98e93dcb8bb1',
            workspace: 'EDIT',
            path: '/sites/mySite/home',
            __typename: 'GenericJCRNode'
        }],
        __typename: 'JCRNodeConnection'
    }
};

describe('PickerDialog - List view', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            classes: {},
            field: {},
            selectedPath: '/sites/mySite',
            setSelectedPath: jest.fn(),
            setSelectedItem: jest.fn(),
            lang: 'en',
            uilang: 'en',
            pickerConfig: {
                showOnlyNodesWithTemplates: false,
                searchSelectorType: '   ',
                selectableTypesTable: 'type'
            },
            formik: {}
        };

        window.contextJsParameters = {
            contextPath: ''
        };
        useQuery.mockClear();
    });

    it('should display the ContentTable', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        cmp.dive().dive().find('ContentTable').exists();
    });

    it('should display the name of content', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive()
            .find('ContentTable');

        expect(cmp.props().data[0].name).toContain('Home');
    });

    it('should have non selectable content', () => {
        setQueryResult({
            jcr: {
                result: queryResultWithChildren
            }
        });
        defaultProps.pickerConfig.showOnlyNodesWithTemplates = true;

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive()
            .find('ContentTable');

        expect(cmp.props().data[0].selectable).toBe(false);
        expect(cmp.props().data[1].selectable).toBe(true);
    });

    it('should display the type of the content', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive()
            .find('ContentTable');

        expect(cmp.props().data[0].type).toContain('Page');
    });

    it('should not display the sub contents columns if we are in search', () => {
        defaultProps.searchTerms = 'search term test';
        setQueryResult({
            jcr: {
                result: queryResult.descendants
            }
        });

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive()
            .find('ContentTable');

        expect(cmp.props().columns[1].property).toContain('type');
    });

    it('should display the sub contents columns if no search', () => {
        setQueryResult({
            jcr: {
                result: queryResultWithChildren
            }
        });

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive()
            .find('ContentTable');

        expect(cmp.props().columns[1].property).toContain('subContentsCount');
        expect(cmp.props().columns[5].property).toBe('navigateInto');
    });

    it('should call setSelectedPath when clicking on navigateInto', () => {
        setQueryResult({
            jcr: {
                result: queryResultWithChildren
            }
        });

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive()
            .find('ContentTable');

        cmp.props().data[0].props.navigateInto.onClick({preventDefault: () => {}});
        expect(defaultProps.setSelectedPath).toHaveBeenCalledWith('/sites/mySite/home');
    });

    it('should display total number of counts', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        t.mockImplementation((key, value) => value ? `${value.totalCount} items found` : key);

        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive()
            .find('CountDisplayer')
            .dive()
            .dive();

        expect(cmp.debug()).toContain('10 items found');
    });

    it('should sort List with lastModified by default', () => {
        shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive();

        expect(useQuery).toHaveBeenCalled();
        expect(useQuery.mock.calls[0][1].variables.fieldSorter).toEqual({
            fieldName: 'lastModified.value',
            sortType: 'DESC'
        });
    });

    it('should sort List with displayName when sort the name column', () => {
        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive();

        cmp.find('ContentTable').simulate('sort', {
            property: 'name'
        });

        expect(useQuery).toHaveBeenCalled();
        expect(useQuery.mock.calls[1][1].variables.fieldSorter).toEqual({
            fieldName: 'displayName',
            sortType: 'DESC'
        });
    });

    it('should sort List with lastModified asc when reclicking on the column', () => {
        const cmp = shallowWithTheme(
            <List {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive().dive();

        cmp.find('ContentTable').simulate('sort', {
            property: 'lastModified'
        });

        expect(useQuery).toHaveBeenCalled();
        expect(useQuery.mock.calls[1][1].variables.fieldSorter).toEqual({
            fieldName: 'lastModified.value',
            sortType: 'ASC'
        });
    });
});
