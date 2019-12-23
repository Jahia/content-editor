import React from 'react';
import {Picker} from './Picker';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

jest.mock('formik', () => {
    let formikvaluesmock;

    return {
        connect: Cmp => props => (
            <Cmp {...props} formik={{values: formikvaluesmock}}/>
        )
    };
});

jest.mock('./Picker.configs.js', () => {
    const EmptyCmp = () => 'empty';
    const FilledCmp = () => 'filled';

    return {
        resolveConfig: () => ({
            picker: {
                empty: EmptyCmp,
                filled: FilledCmp
            },
            treeConfigs: []
        })
    };
});

describe('Picker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                displayName: 'imageid',
                name: 'imageid',
                selectorType: 'MediaPicker',
                readOnly: false
            },
            id: 'imageid',
            editorContext: {},
            setActionContext: jest.fn()
        };
    });

    it('should display the EmptyCmp when the field is not filed', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.debug()).toContain('EmptyCmp');
    });

    it('should display the FilledCmp when the field is filed', () => {
        defaultProps.value = 'DummyValue';

        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.debug()).toContain('FilledCmp');
    });
});
