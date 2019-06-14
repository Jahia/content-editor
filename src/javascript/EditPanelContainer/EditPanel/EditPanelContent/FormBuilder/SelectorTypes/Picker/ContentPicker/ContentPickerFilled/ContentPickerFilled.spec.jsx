import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ContentPickerFilled} from './ContentPickerFilled';
import {setQueryResult} from 'react-apollo-hooks';
import {encodeJCRPath} from '../../../../../../EditPanel.utils';

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

const queryResult = {
    path: '/sites/digitall/files/app.css',
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
                lang: 'en',
                site: 'digitall'
            },
            formik: {},
            nodeTreeConfigs: [],
            pickerConfig: {}
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
        ).dive();

        expect(cmp.find('Picker').props().fieldData.url).toContain(
            encodeJCRPath(queryResult.primaryNodeType.icon)
        );
    });

    it('should display the display name of the content from field', () => {
        const cmp = shallowWithTheme(
            <ContentPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('Picker').props().fieldData.name).toContain(
            queryResult.displayName
        );
    });

    it('should display the information (nodeType display name) of the content from field', () => {
        const cmp = shallowWithTheme(
            <ContentPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const contentInfo = cmp.find('Picker').props().fieldData.info;
        expect(contentInfo).toContain(queryResult.primaryNodeType.displayName);
    });

    it('should display the Dialog when clicking on the picker', () => {
        const cmp = shallowWithTheme(
            <ContentPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('Picker').simulate('click');

        expect(cmp.find('ContentPickerDialog').props().isOpen).toBe(true);
    });

    it('should specify the initialPath with data selected', () => {
        const cmp = shallowWithTheme(
            <ContentPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('ContentPickerDialog').props().initialPath).toBe('/files');
    });
});
