import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

jest.mock('react-apollo-hooks', () => {
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

import {setQueryResult} from 'react-apollo-hooks';
import {ContentTable} from './ContentTable';

const queryResult = {
    descendants: {
        pageInfo: {
            totalCount: 1,
            __typename: 'PageInfo'
        },
        nodes: [{
            displayName: 'Home',
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
    descendants: {
        pageInfo: {
            totalCount: 1,
            __typename: 'PageInfo'
        },
        nodes: [{
            displayName: 'Home',
            primaryNodeType: {
                typeName: 'Page',
                icon: '/jahia/modules/assets/icons/jnt_page',
                __typename: 'JCRNodeType'
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
            path: '/sites/mySite/home',
            __typename: 'GenericJCRNode'
        }, {
            displayName: 'Home',
            primaryNodeType: {
                typeName: 'Page',
                icon: '/jahia/modules/assets/icons/jnt_page',
                __typename: 'JCRNodeType'
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

describe('contentListTable', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {},
            selectedPath: '/sites/mySite',
            setSelectedPath: jest.fn(),
            setSelectedItem: jest.fn(),
            editorContext: {
                site: 'mySite',
                lang: 'fr',
                uiLang: 'en'
            },
            tableConfig: {
                searchSelectorType: '   ',
                typeFilter: [],
                recursionTypesFilter: []
            },
            formik: {}
        };

        window.contextJsParameters = {
            contextPath: ''
        };
    });

    it('should display the ContentTable', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('WithStyles(ContentTable)').exists();
    });

    it('should display the name of content', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().data[0].name).toContain('Home');
    });

    it('should display the type of the content', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().data[0].type).toContain('Page');
    });

    it('should not display the sub contents columns if there is no content with sub contents', () => {
        setQueryResult({
            jcr: {
                result: queryResult
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().columns[1].property).toContain('type');
        expect(cmp.props().data[0].subContentsCount).toBeUndefined();
    });

    it('should display the sub contents columns if there is content with sub contents', () => {
        setQueryResult({
            jcr: {
                result: queryResultWithChildren
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().columns[1].property).toContain('subContentsCount');
        expect(cmp.props().data[0].subContentsCount).toBe(5);
    });

    it('should add button navigateInto when there is subContent', () => {
        setQueryResult({
            jcr: {
                result: queryResultWithChildren
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().columns[5].property).toBe('navigateInto');
        expect(cmp.props().data[0].navigateInto).toBe(true);
    });

    it('should not add button navigateInto when there is subContent', () => {
        setQueryResult({
            jcr: {
                result: queryResultWithChildren
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().data[1].navigateInto).toBe(false);
    });

    it('should call setSelectedPath when clicking on navigateInto', () => {
        setQueryResult({
            jcr: {
                result: queryResultWithChildren
            }
        });

        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.props().data[0].props.navigateInto.onClick({preventDefault: () => {}});
        expect(defaultProps.setSelectedPath).toHaveBeenCalledWith('/sites/mySite/home');
    });
});
