import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ContentPickerFilled} from './ContentPickerFilled';

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
    path: '/Nothings/going/to/happen',
    displayName: 'maybe all the aunts in the world will sip sweetly',
    primaryNodeType: {
        icon: 'at/their/trough/of/tea',
        displayName: 'and almost say one word for anything'
    }
};

describe('contentPickerFilled', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {},
            uuid: 'uuidOfTheImage',
            id: 'yoloID',
            editorContext: {
                lang: 'en'
            }
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
            <ContentPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().fieldData.url).toContain(encodeJCRPath(queryResult.primaryNodeType.icon));
    });

    it('should display the display name of the content from field', () => {
        const cmp = shallowWithTheme(
            <ContentPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.props().fieldData.name).toContain(queryResult.displayName);
    });

    it('should display the information (nodeType display name) of the content from field', () => {
        const cmp = shallowWithTheme(
            <ContentPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        const contentInfo = cmp.props().fieldData.info;
        expect(contentInfo).toContain(queryResult.primaryNodeType.displayName);
    });
});
