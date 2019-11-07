import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ImageListQuery} from './ImageListQuery';

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

const queryResult = {
    children: {
        nodes: [
            {
                uuid: 'image-uuid',
                path: '/a/valid/jcrPath/#/g/200/300',
                name: 'Beautiful_hedgehog.jpg',
                height: {value: 1532400},
                width: {value: 1234134},
                lastModified: {value: 55555},
                children: {
                    nodes: [{mimeType: {value: 'image/jpeg'}}]
                }
            }
        ]
    }
};

describe('imageListQuery', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                displayName: 'x',
                name: 'x',
                readOnly: false,
                selectorType: 'MediaPicker'
            },
            selectedPath: '',
            setSelectedItem: jest.fn(),
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

    it('should display the ImageList', () => {
        const cmp = shallowWithTheme(
            <ImageListQuery {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('WithStyles(ImageList)').exists();
    });

    it('should display the name of image', () => {
        const cmp = shallowWithTheme(
            <ImageListQuery {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().images[0].name).toContain('Beautiful_hedgehog.jpg');
    });

    it('should display the type of image', () => {
        const cmp = shallowWithTheme(
            <ImageListQuery {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().images[0].type).toContain('jpeg');
    });
});
