import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {MediaPickerFilled} from './MediaPickerFilled';

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
import {encodeJCRPath} from '../../../../../EditPanel.utils';

const queryResult = {
    path: '/a/valid/jcrPath/#/g/200/300',
    name: 'Beautiful_hairy_pussy.jpg',
    height: {value: 1532400},
    width: {value: 1234134},
    weight: 1.2,
    children: {
        nodes: [{mimeType: {value: 'jpeg'}}]
    }
};

describe('mediaPickerFilled', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {},
            uuid: 'uuidOfTheImage',
            id: 'yoloID'
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

    it('should display the src from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().fieldData.url).toContain(encodeJCRPath(queryResult.path));
    });

    it('should display the name of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().fieldData.name).toContain(queryResult.name);
    });

    it('should display the information (type, size and weight) of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        const imageInfo = cmp.props().fieldData.info;
        expect(imageInfo).toContain(queryResult.width.value);
        expect(imageInfo).toContain(queryResult.height.value);
        expect(imageInfo).toContain(queryResult.weight);
        expect(imageInfo).toContain(queryResult.children.nodes[0].mimeType.value);
    });
});
