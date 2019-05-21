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
import {encodeJCRPath} from '../../../../EditPanel.utils';

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

describe('mediaPicker filled', () => {
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

        expect(cmp.find('figure').props().style.backgroundImage).toContain(encodeJCRPath(queryResult.path));
    });

    it('should display the weight of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(queryResult.weight);
    });

    it('should display the type of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(queryResult.children.nodes[0].mimeType.value);
    });

    it('should display the name of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(queryResult.name);
    });

    it('should display the size of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(queryResult.height.value);
        expect(cmp.debug()).toContain(queryResult.width.value);
    });
});
