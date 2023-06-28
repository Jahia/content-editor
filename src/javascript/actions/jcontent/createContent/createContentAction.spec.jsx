import React from 'react';
import {useSelector} from 'react-redux';
import {useNodeChecks, useNodeInfo} from '@jahia/data-helper';
import {shallow} from '@jahia/test-framework';
import {Typography} from '@jahia/moonstone';
import {
    transformNodeTypesToActions,
    useCreatableNodetypesTree,
    flattenNodeTypes,
    childrenLimitReachedOrExceeded
} from './createContent.utils';

import {createContentAction} from './createContentAction';

jest.mock('react-redux', () => {
    return {useSelector: jest.fn()};
});
jest.mock('@jahia/data-helper', () => {
    return {useNodeChecks: jest.fn(),
        useNodeInfo: jest.fn()};
});
jest.mock('~/ContentTypeSelectorModal', () => jest.fn());
jest.mock('./createContent.utils', () => {
    return {
        useCreatableNodetypesTree: jest.fn(),
        flattenNodeTypes: jest.fn(),
        transformNodeTypesToActions: jest.fn(),
        childrenLimitReachedOrExceeded: jest.fn()
    };
});

describe('CreateNewContent', () => {
    let CreateNewContent;
    let defaultProps;
    let loading;
    let nodeTypes;
    beforeEach(() => {
        CreateNewContent = createContentAction.component;
        defaultProps = {
            render: jest.fn(() => {
                return <Typography>render</Typography>;
            })
        };
        useSelector.mockImplementation(() => {
            return {language: 'en', uilang: 'en'};
        });
        useNodeChecks.mockImplementation(() => {
            return {node: {uuid: 'xxx'}, loading: loading};
        });
        useNodeInfo.mockImplementation(() => {
            return {node: {uuid: 'xxx'}, loading: loading};
        });
        useCreatableNodetypesTree.mockImplementation(() => {
            return {
                loadingTypes: loading,
                error: undefined,
                nodetypes: nodeTypes
            };
        });
        flattenNodeTypes.mockImplementation(l => l);
        useCreatableNodetypesTree.mockImplementation(() => {
            return {
                loadingTypes: loading,
                error: undefined,
                nodetypes: nodeTypes
            };
        });
        transformNodeTypesToActions.mockImplementation(l => l);
        childrenLimitReachedOrExceeded.mockImplementation(() => false);
    });

    it('should not render CreateNewContent when loading', () => {
        defaultProps.loading = jest.fn(() => {
            return <Typography>Loading</Typography>;
        });

        defaultProps.path = '/sites/digitall/home';
        loading = true;
        nodeTypes = ['nodetype1', 'nodetype2'];
        const cmp = shallow(<CreateNewContent {...defaultProps}/>);
        console.log(cmp.debug());
        const loadingComponent = cmp.find('mockConstructor').at(0).shallow();
        console.log(loadingComponent.debug());
        expect(loadingComponent.find('Typography').length).toBe(1);
        expect(loadingComponent.find('Typography').shallow().debug()).toContain('Loading');
    });
    it('should contain 2 nodetypes when loading done', () => {
        defaultProps.loading = jest.fn(() => {
            return <Typography>Loading</Typography>;
        });

        defaultProps.path = '/sites/digitall/home';
        loading = false;
        nodeTypes = ['nodetype1', 'nodetype2'];
        const cmp = shallow(<CreateNewContent {...defaultProps}/>);
        // 2 is the number of types returned.
        expect(cmp.length).toEqual(nodeTypes.length);
        expect(cmp.at(0).props().isAllTypes).toBe(false);
    });
    it('should contain "allTypes" only when no types found and loading done', () => {
        defaultProps.loading = jest.fn(() => {
            return <Typography>Loading</Typography>;
        });

        defaultProps.path = '/sites/digitall/home';
        loading = false;
        nodeTypes = undefined;
        const cmp = shallow(<CreateNewContent {...defaultProps}/>);
        // 1 is the number of types returned.
        expect(cmp.length).toEqual(1);
        console.log(cmp.debug());
        const renderingComponent = cmp.find('mockConstructor').at(0).shallow();
        console.log(renderingComponent.debug());
        expect(cmp.props().isAllTypes).toBe(true);
    });
});
