import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';

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
import {ContentTable} from './ContentTable.container';

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

describe('contentListTable', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {},
            selectedPath: '/sites/mySite',
            setSelectedItem: jest.fn(),
            editorContext: {
                site: 'mySite',
                lang: 'en'
            },
            formik: {}
        };

        window.contextJsParameters = {
            contextPath: ''
        };

        setQueryResult({
            jcr: {
                result: queryResult
            }
        });
    });

    it('should display the ContentTable', () => {
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
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().data[0].type).toContain('Page');
    });
});

