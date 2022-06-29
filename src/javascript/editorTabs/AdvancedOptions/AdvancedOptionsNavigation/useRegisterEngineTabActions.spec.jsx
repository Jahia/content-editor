import {tabShouldBeDisplayed, useRegisterEngineTabActions} from './useRegisterEngineTabActions';
import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {registry} from '@jahia/ui-extender';
import {openEngineTabsAction} from './openEngineTabsAction';

jest.mock('./engineTabs.utils', () => {
    return {
        getNodeTypes: jest.fn()
    };
});

jest.mock('@apollo/react-hooks', () => {
    return {
        useQuery: jest.fn()
    };
});

jest.spyOn(React, 'useEffect').mockImplementation(f => f());

jest.mock('./engineTabs.permission.gql-query', () => {
    return {
        engineTabsPermissionCheckQuery: jest.fn()
    };
});

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => ({
            nodeData: {
                path: '/node',
                displayName: 'A node ',
                uuid: '1234-5678-8900',
                mixinTypes: [{name: 'jmix:lockable'}, {name: 'jmix:image'}],
                primaryNodeType: 'jnt: content'
            },
            site: 'digitall'
        })
    };
});

jest.mock('@jahia/ui-extender', () => {
    return {
        registry: {
            addOrReplace: jest.fn(),
            get: jest.fn()
        }
    };
});

describe('useRegisterEngineTabActions', () => {
    let useQueryResponse;
    beforeEach(() => {
        window.authoringApi = {
            getEditTabs: () => {
                return [{
                    id: 'content',
                    title: 'Content',
                    requiredPermission: 'viewContentTab'},
                {
                    id: 'metadata',
                    title: 'Metadata',
                    requiredPermission: 'viewMetadataTab'
                }];
            }
        };

        useQueryResponse = {
            loading: null,
            error: null,
            data: {
                jcr: {
                    nodeByPath: {
                        content: true,
                        metadata: true
                    }
                }}
        };

        useQuery.mockImplementation(() => useQueryResponse);
    });

    it('should not throw an error', () => {
        useRegisterEngineTabActions();
    });

    it('should return loading true when request is pending', () => {
        useQueryResponse.loading = true;
        const {loading} = useRegisterEngineTabActions();

        expect(loading).toBe(true);
    });

    it('should return the error when request return an error', () => {
        useQueryResponse.error = new Error('graphqlError');
        const {error} = useRegisterEngineTabActions();

        expect(error).toBe(useQueryResponse.error);
    });

    it('should add to registry action for each tab when you have permission', () => {
        useRegisterEngineTabActions();

        expect(registry.addOrReplace).toHaveBeenCalledWith('action', 'contentEditorGWTTabAction_content', openEngineTabsAction, {
            buttonLabel: 'Content',
            targets: ['AdvancedOptionsActions:3'],
            tabs: ['content'],
            shouldBeDisplayed: tabShouldBeDisplayed
        });
    });
});
