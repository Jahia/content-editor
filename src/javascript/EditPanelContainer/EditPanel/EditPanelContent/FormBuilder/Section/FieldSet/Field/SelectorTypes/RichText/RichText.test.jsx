import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {RichTextCmp} from './RichText';
import {dsGenericTheme} from '@jahia/design-system-kit';

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
                selectorType: 'RichText'
            },
            formik: {
                setFieldValue: () => {},
                values: []
            }
        };
    });

    const handleChange = jest.fn();

    const buildComp = props => {
        const mainComponent = shallowWithTheme(<RichTextCmp {...props}/>, {}, dsGenericTheme);
        const RenderProps = mainComponent.props().render;
        return shallowWithTheme(<RenderProps form={{setFieldTouched: () => {}, setFieldValue: handleChange}}/>, {}, dsGenericTheme);
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
});
