import React from 'react';
import {shallow} from '@jahia/test-framework';

import {RichText} from './RichText';
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

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

const RICH_TEXT_COMPONENT_TAG = 'CKEditor';

describe('RichText component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'richID',
            value: 'initial value',
            field: {
                name: 'x',
                displayName: 'x',
                readOnly: false,
                selectorType: 'RichText',
                selectorOptions: []
            },
            onChange: jest.fn()
        };

        setQueryResult({
            forms: {
                ckeditorConfigPath: '',
                ckeditorToolbar: 'Light'
            }
        });

        window.contextJsParameters = {
            contextPath: ''
        };
    });
    it('should contain one RichText component', () => {
        const cmp = shallow(<RichText {...props}/>);
        expect(cmp.find(RICH_TEXT_COMPONENT_TAG).length).toBe(1);
    });

    it('should obtain its initial value from value prop', () => {
        props.value = 'some dummy value';
        const cmp = shallow(<RichText {...props}/>);

        expect(cmp.find(RICH_TEXT_COMPONENT_TAG)
            .prop('data')
        ).toEqual('some dummy value');
    });

    it('should call formik.setFieldValue on change', () => {
        const dummyEditor = {
            editor: {
                getData: () => 'some dummy value'
            }
        };

        const cmp = shallow(<RichText {...props}/>);
        cmp.find(RICH_TEXT_COMPONENT_TAG)
            .simulate('change', dummyEditor);

        expect(props.onChange.mock.calls.length).toBe(1);
        expect(props.onChange.mock.calls).toEqual([[dummyEditor.editor.getData()]]);
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = shallow(<RichText {...props}/>);

        expect(cmp.find(RICH_TEXT_COMPONENT_TAG)
            .prop('readOnly')
        ).toEqual(readOnly);
    };

    it('should load default configuration if selector options are not available in the definition', () => {
        const cmp = shallow(<RichText {...props}/>);
        expect(cmp.find(RICH_TEXT_COMPONENT_TAG).prop('config'))
            .toMatchObject({
                contentEditorFieldName: 'richID',
                customConfig: '',
                toolbar: 'Light',
                width: '100%'
            });
    });

    it('should load configuration if selector options are available in the definition', () => {
        props.field.selectorOptions = [
            {name: 'ckeditor.toolbar', value: 'dictionary'},
            {name: 'ckeditor.customConfig', value: '/path/to/my/custom/config.js'}
        ];
        const cmp = shallow(<RichText {...props}/>);
        expect(cmp.find(RICH_TEXT_COMPONENT_TAG).prop('config'))
            .toMatchObject({
                contentEditorFieldName: 'richID',
                customConfig: '/path/to/my/custom/config.js',
                toolbar: 'dictionary',
                width: '100%'
            });
    });
});
