import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {MediaPickerFilled} from './MediaPickerFilled';
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
    path: '/sites/digitall/files/Beautiful_hairy_pussy.jpg',
    name: 'Beautiful_hairy_pussy.jpg',
    height: {value: 1532400},
    width: {value: 1234134},
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
            id: 'yoloID',
            formik: {},
            editorContext: {
                site: 'digitall'
            },
            setActionContext: () => {}
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
            .find('Picker');

        expect(cmp.props().fieldData.url).toContain(
            encodeJCRPath(queryResult.path)
        );
    });

    it('should display the name of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('Picker');

        expect(cmp.props().fieldData.name).toContain(queryResult.name);
    });

    it('should display the information (type, size) of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('Picker');

        const imageInfo = cmp.props().fieldData.info;
        expect(imageInfo).toContain(queryResult.width.value);
        expect(imageInfo).toContain(queryResult.height.value);
        expect(imageInfo).toContain(
            queryResult.children.nodes[0].mimeType.value
        );
    });

    it('should specify the initialSelectedItem with data selected', () => {
        const cmp = shallowWithTheme(
            <MediaPickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('MediaPickerDialog').props().initialSelectedItem).toBe('/sites/digitall/files/Beautiful_hairy_pussy.jpg');
    });
});
