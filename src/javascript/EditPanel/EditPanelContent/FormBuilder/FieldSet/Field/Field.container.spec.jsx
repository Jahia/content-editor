import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {FieldContainer} from './Field.container';
import {registerSelectorTypes} from '~/SelectorTypes';
import {registry} from '@jahia/ui-extender';
import {dsGenericTheme} from '@jahia/design-system-kit';

jest.mock('~/EditPanel/WorkInProgress/WorkInProgress.utils', () => {
    return {
        showChipField: jest.fn()
    };
});

let mockEditorContext = {
    lang: 'en',
    siteInfo: {
        languages: []
    }
};
jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => (mockEditorContext)
    };
});

jest.mock('@apollo/react-hooks', () => {
    let responsemock;
    return {
        useApolloClient: () => responsemock,
        setResponseMock: m => {
            responsemock = m;
        }
    };
});

describe('Field container component', () => {
    registerSelectorTypes(registry);

    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            field: {
                name: 'x',
                displayName: 'displayName',
                selectorType: 'RichText',
                readOnly: false,
                selectorOptions: []
            },
            targets: [{name: 'test'}],
            editorContext: {siteInfo: {languages: []}},
            formik: {
                errors: {},
                values: []
            }
        };
    });

    it('should render a Text component when field type is "Text"', () => {
        defaultProps.field.selectorType = 'Text';
        const cmp = shallowWithTheme(<FieldContainer {...defaultProps}/>,
            {},
            dsGenericTheme).dive();
        const fieldcmp = cmp.dive();
        const field = fieldcmp.find('SingleField');
        expect(field.props().field.selectorType).toBe('Text');
    });

    it('should render a RichText component when field type is "RichText"', () => {
        const cmp = shallowWithTheme(<FieldContainer {...defaultProps}/>,
            {},
            dsGenericTheme).dive().dive().find('SingleField');
        expect(cmp.props().field.selectorType).toBe('RichText');
    });

    it('should render a ContentPicker component when field type is "picker"', () => {
        defaultProps.field.selectorType = 'Picker';
        const cmp = shallowWithTheme(<FieldContainer {...defaultProps}/>,
            {},
            dsGenericTheme).dive().dive().find('SingleField');
        expect(cmp.props().field.selectorType).toBe('Picker');
    });

    it('should render a MediaPicker component when field type is "picker" and option type is "image"', () => {
        defaultProps.field.selectorType = 'Picker';
        defaultProps.field.selectorOptions = [{name: 'type', value: 'image'}];

        const cmp = shallowWithTheme(<FieldContainer {...defaultProps}/>,
            {},
            dsGenericTheme).dive().dive().find('SingleField');
        expect(cmp.props().field.selectorType).toBe('Picker');
    });
});
