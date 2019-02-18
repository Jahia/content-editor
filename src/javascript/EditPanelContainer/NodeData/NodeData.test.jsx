import React from 'react';
import wait from 'waait';
import TestRenderer from 'react-test-renderer';
import {MockedProvider} from 'react-apollo/test-utils';
import {ProgressOverlay} from '@jahia/react-material';

import {NodeData} from './NodeData';
import {NodeQuery} from './NodeData.gql-queries';

describe('<NodeData/>', () => {
    const query = NodeQuery;
    const path = '/';
    const language = 'en';

    let request;
    let result;

    beforeEach(() => {
        request = {query: query, variables: {path: path, language: language}};
        result = {data: {jcr: {result: []}}};
    });

    describe('on load', () => {
        it('displays a loader', () => {
            const mock = {request: request, result: result};

            const component = TestRenderer.create(
                <MockedProvider mocks={[mock]} addTypename={false}>
                    <NodeData path={path} lang={language}>
                        {() => {
                            return null;
                        }
                    }
                    </NodeData>
                </MockedProvider>
            );

            const expectedOutput = TestRenderer.create(<ProgressOverlay/>).toJSON();
            expect(component.toJSON()).toEqual(expectedOutput);
        });
    });

    describe('on error', () => {
        it('displays an error message', async () => {
            const errorMessage = 'An error occurred';
            const mock = {request: request, error: new Error()};

            const component = TestRenderer.create(
                <MockedProvider mocks={[mock]}>
                    <NodeData path={path} lang={language} t={() => errorMessage}>
                        {() => {
                            return null;
                        }}
                    </NodeData>
                </MockedProvider>
            );

            await wait(0);

            expect(component.toJSON()).toContain(errorMessage);
        });
    });
});
