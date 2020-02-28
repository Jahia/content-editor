import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {RichTextCmp} from './RichText';
import {dsGenericTheme} from '@jahia/design-system-kit';

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

import {setQueryResult} from '@apollo/react-hooks';

const RICH_TEXT_COMPONENT_TAG = 'CKEditor';

describe('RichText component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'richID',
            field: {
                name: 'x',
                displayName: 'x',
                readOnly: false,
                selectorType: 'RichText',
                selectorOptions: []
            },
            formik: {
                setFieldValue: () => {},
                values: []
            }
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

    const handleChange = jest.fn();
    const handleFieldTouched = jest.fn();

    const buildComp = componentProps => {
        const mainComponent = shallowWithTheme(<RichTextCmp {...componentProps}/>, {}, dsGenericTheme);
        const RenderProps = mainComponent.find('FormikConnect(FastFieldInner)').props().render;
        return shallowWithTheme(<RenderProps form={{setFieldTouched: handleFieldTouched, setFieldValue: handleChange}}/>, {}, dsGenericTheme);
    };

    it('should contain one RichText component', () => {
        const wrapper = buildComp(props);
        expect(wrapper.find(RICH_TEXT_COMPONENT_TAG).length).toBe(1);
    });

    it('should obtain its initial value from value prop', () => {
        props.value = 'some dummy value';
        const wrapper = buildComp(props);
        expect(wrapper.find(RICH_TEXT_COMPONENT_TAG)
            .prop('data')
        ).toEqual('some dummy value');
    });

    it('should call formik.setFieldValue on change', () => {
        const dummyEditor = {
            getData: () => 'some dummy value'
        };

        const wrapper = buildComp(props);
        wrapper.find(RICH_TEXT_COMPONENT_TAG)
            .simulate('change', {editor: dummyEditor});

        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls).toEqual([[
            props.id, dummyEditor.getData(), true
        ]]);
        expect(handleFieldTouched).toHaveBeenCalledWith('x', true);
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const wrapper = buildComp(props);

        expect(wrapper.find(RICH_TEXT_COMPONENT_TAG)
            .prop('readOnly')
        ).toEqual(readOnly);
    };

    it('should load default configuration if selector options are not available in the definition', () => {
        const wrapper = buildComp(props);
        expect(wrapper.find(RICH_TEXT_COMPONENT_TAG).prop('config'))
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
        const wrapper = buildComp(props);
        expect(wrapper.find(RICH_TEXT_COMPONENT_TAG).prop('config'))
            .toMatchObject({
                contentEditorFieldName: 'richID',
                customConfig: '/path/to/my/custom/config.js',
                toolbar: 'dictionary',
                width: '100%'
            });
    });
});
