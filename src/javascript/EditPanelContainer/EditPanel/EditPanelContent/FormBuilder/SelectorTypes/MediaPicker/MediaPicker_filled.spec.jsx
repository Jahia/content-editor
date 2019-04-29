import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {MediaPickerFilled} from './MediaPicker_filled';

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

describe('mediaPicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {},
            selectedImgId: 'uuidOfTheImage',
            id: 'yoloID'
        };

        window.contextJsParameters = {
            contextPath: ''
        };

        setQueryResult({
            jcr: {
                result: {
                    path: 'http://placekitten.com/g/200/300',
                    name: 'Beautiful_hairy_pussy.jpg',
                    height: {value: 1532400},
                    width: {value: 1234134},
                    weight: 1.2,
                    children: {
                        nodes: [{mimeType: {value: 'jpeg'}}]
                    }
                }
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
        expect(cmp.debug()).toContain('http://placekitten.com/g/200/300');
    });

    it('should display the weight of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(1.2);
    });

    it('should display the type of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain('jpeg');
    });

    it('should display the name of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain('Beautiful_hairy_pussy.jpg');
    });

    it('should display the size of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(1532400);
        expect(cmp.debug()).toContain(1234134);
    });
});
