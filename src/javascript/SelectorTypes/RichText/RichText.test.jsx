import React from 'react';
import {shallow} from '@jahia/test-framework';

import {RichTextCmp} from './RichText';

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

let useEffect;

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => {
            useEffect = cb();
        }
    };
});

import {setQueryResult} from '@apollo/react-hooks';

const RICH_TEXT_COMPONENT_TAG = 'CKEditor';

describe('RichText component', () => {
    let props;
    const onDestroy = jest.fn();

    beforeEach(() => {
        props = {
            onDestroy,
            id: 'richID',
            value: 'initial value',
            field: {
                name: 'x',
                displayName: 'x',
                readOnly: false,
                selectorType: 'RichText',
                selectorOptions: []
            },
            onChange: jest.fn(),
            onInit: jest.fn()
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
        const cmp = shallow(<RichTextCmp {...props}/>);
        expect(cmp.find(RICH_TEXT_COMPONENT_TAG).length).toBe(1);
    });

    it('should obtain its initial value from value prop, and call onInit', () => {
        props.value = 'some dummy value';
        const cmp = shallow(<RichTextCmp {...props}/>);

        expect(cmp.find(RICH_TEXT_COMPONENT_TAG)
            .prop('data')
        ).toEqual('some dummy value');
        expect(props.onInit.mock.calls.length).toBe(1);
        expect(props.onInit).toHaveBeenCalledWith(props.value);
    });

    it('should onDestroy called when element detached the element', () => {
        const cmp = shallow(<RichTextCmp {...props}/>);
        cmp.unmount();
        useEffect();
        expect(onDestroy).toHaveBeenCalled();
    });

    it('should call formik.setFieldValue on change', () => {
        const dummyEditor = {
            editor: {
                getData: () => 'some dummy value'
            }
        };

        const cmp = shallow(<RichTextCmp {...props}/>);
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
        const cmp = shallow(<RichTextCmp {...props}/>);

        expect(cmp.find(RICH_TEXT_COMPONENT_TAG)
            .prop('readOnly')
        ).toEqual(readOnly);
    };

    it('should load default configuration if selector options are not available in the definition', () => {
        const cmp = shallow(<RichTextCmp {...props}/>);
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
        const cmp = shallow(<RichTextCmp {...props}/>);
        expect(cmp.find(RICH_TEXT_COMPONENT_TAG).prop('config'))
            .toMatchObject({
                contentEditorFieldName: 'richID',
                customConfig: '/path/to/my/custom/config.js',
                toolbar: 'dictionary',
                width: '100%'
            });
    });
});
