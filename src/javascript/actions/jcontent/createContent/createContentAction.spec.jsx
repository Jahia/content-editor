import React from 'react';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useSelector} from 'react-redux';
import {useNodeChecks, useNodeInfo} from '@jahia/data-helper';
import {shallow} from '@jahia/test-framework';
import {transformNodeTypesToActions, useCreatableNodetypes} from './CreateNewContent.utils';

import createContentAction from './CreateNewContent.action';

jest.mock('~/ContentEditorHistory', () => {
    return {useContentEditorHistory: jest.fn()};
});
jest.mock('react-redux', () => {
    return {useSelector: jest.fn()};
});
jest.mock('@jahia/data-helper', () => {
    return {useNodeChecks: jest.fn(),
        useNodeInfo: jest.fn()};
});
jest.mock('./CreateNewContentDialog', () => jest.fn());
jest.mock('./CreateNewContent.utils', () => {
    return {useCreatableNodetypes: jest.fn(), transformNodeTypesToActions: jest.fn()};
});

describe('CreateNewContent', () => {
    let CreateNewContent;
    let defaultProps;
    let loading;
    let nodeTypes;
    beforeEach(() => {
        CreateNewContent = createContentAction.component;
        defaultProps = {
            render: jest.fn()
        };
        useContentEditorHistory.mockImplementation(() => {
            return {redirect: jest.fn()};
        });
        useSelector.mockImplementation(() => {
            return {language: 'en', uilang: 'en'};
        });
        useNodeChecks.mockImplementation(() => {
            return {node: {uuid: 'xxx'}, loading: loading};
        });
        useNodeInfo.mockImplementation(() => {
            return {node: {uuid: 'xxx'}, loading: loading};
        });
        useCreatableNodetypes.mockImplementation(() => {
            return {
                loadingTypes: loading,
                error: undefined,
                nodetypes: nodeTypes
            };
        });
        transformNodeTypesToActions.mockImplementation(() => {
            return jest.fn();
        });
    });

    it('should not render CreateNewContent when loading', () => {
        defaultProps.loading = 'Loading';
        loading = true;
        nodeTypes = ['nodetype1', 'nodetype2'];
        const cmp = shallow(<CreateNewContent {...defaultProps}/>);
        expect(cmp.debug()).toContain('Loading');
    });
    it('should contain 2 nodetypes when loading done', () => {
        defaultProps.loading = false;
        loading = false;
        nodeTypes = ['nodetype1', 'nodetype2'];
        const cmp = shallow(<CreateNewContent {...defaultProps}/>);
        // 2 is the number of types returned.
        expect(cmp.length).toEqual(nodeTypes.length);
    });
    it('should contains "allTypes" only when no types found and loading done', () => {
        defaultProps.loading = false;
        loading = false;
        nodeTypes = undefined;
        const cmp = shallow(<CreateNewContent {...defaultProps}/>);
        // 2 is the number of types returned.
        expect(cmp.length).toEqual(1);
        expect(cmp.props().id).toEqual('allTypes');
    });
});
