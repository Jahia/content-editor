import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Thumbnail} from './Thumbnail';
import {setQueryResult} from '@apollo/react-hooks';

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

const queryResult = {
    descendants: {
        pageInfo: {
            totalCount: 150000
        },
        nodes: [
            {
                uuid: 'image-uuid',
                path: '/a/valid/jcrPath/#/g/200/300',
                displayName: 'Beautiful_hedgehog.jpg',
                height: {value: 1532400},
                width: {value: 1234134},
                lastModified: {value: 55555},
                metadata: {
                    nodes: [{mimeType: {value: 'image/jpeg'}}]
                }
            }
        ]
    }
};

describe('PickerDialog - Thumbnail view', () => {
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
            formik: {},
            pickerConfig: {
                showOnlyNodesWithTemplates: true,
                searchSelectorType: '   ',
                selectableTypesTable: 'type'
            },
            onThumbnailDoubleClick: jest.fn()
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
            <Thumbnail {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        cmp.find('ImageList').exists();
    });

    it('should display the name of image', () => {
        const cmp = shallowWithTheme(
            <Thumbnail {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('ImageList');

        expect(cmp.props().images[0].name).toContain('Beautiful_hedgehog.jpg');
    });

    it('should display the type of image', () => {
        const cmp = shallowWithTheme(
            <Thumbnail {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('ImageList');

        expect(cmp.props().images[0].type).toContain('jpeg');
    });
});
