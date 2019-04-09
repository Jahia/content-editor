import React from 'react';
import waitForExpect from 'wait-for-expect';
import TestRenderer from 'react-test-renderer';
import {MockedProvider} from 'react-apollo/test-utils';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {fragmentMatcher} from '@jahia/apollo-dx';
import {ProgressOverlay} from '@jahia/react-material';

import {NodeData} from './NodeData';
import {NodeQuery} from './NodeData.gql-queries';

describe('NodeData component', () => {
    let request;

    beforeEach(() => {
        request = {
            query: NodeQuery,
            variables: {
                path: '/',
                language: 'en'
            }
        };
    });

    describe('on load', () => {
        it('displays a loader', () => {
            const {path, language} = request.variables;
            const component = TestRenderer.create(
                <MockedProvider mocks={[]}>
                    <NodeData path={path} lang={language}>
                        {() => {
                            return null;
                        }}
                    </NodeData>
                </MockedProvider>
            );

            const expectedOutput = TestRenderer.create(<ProgressOverlay/>).toJSON();
            expect(component.toJSON()).toEqual(expectedOutput);
        });
    });

    describe('on error', () => {
        it('displays an error message', async () => {
            const {path, language} = request.variables;
            const mocks = [{request, error: new Error()}];
            const component = TestRenderer.create(
                <MockedProvider mocks={mocks}>
                    <NodeData path={path} lang={language} t={s => s}>
                        {() => {
                            return null;
                        }}
                    </NodeData>
                </MockedProvider>
            );

            await waitForExpect(() => {
                expect(component.toJSON()).toContain(
                    'content-media-manager:label.contentManager.error.queryingContent'
                );
            });
        });
    });

    describe('on success', () => {
        it('returns query results', async () => {
            const {path, language} = request.variables;
            const mockData = {
                uuid: 'uuid',
                workspace: 'workspace',
                path: 'path',
                displayName: 'A displayName',
                primaryNodeType: {
                    name: 'x',
                    properties: [],
                    __typename: 'JCRNodeType'
                },
                aggregatedPublicationInfo: {
                    publicationStatus: 'PUBLISHED',
                    __typename: 'GqlPublicationInfo'
                },
                properties: [],
                __typename: 'GenericJCRNode'
            };
            const mocks = [{
                request: request,
                result: {
                    data: {
                        jcr: {
                            result: mockData,
                            __typename: 'JCRQuery'
                        }
                    }
                }
            }];
            const component = TestRenderer.create(
                <MockedProvider mocks={mocks} cache={new InMemoryCache({fragmentMatcher})}>
                    <NodeData path={path} lang={language}>
                        {({nodeData}) => {
                            return nodeData.displayName;
                        }}
                    </NodeData>
                </MockedProvider>
            );

            await waitForExpect(() => {
                const output = component.toJSON();
                expect(output).toEqual(mockData.displayName);
            });
        });
    });
});
