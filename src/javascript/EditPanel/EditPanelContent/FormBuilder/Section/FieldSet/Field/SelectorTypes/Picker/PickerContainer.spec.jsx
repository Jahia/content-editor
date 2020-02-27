import React from 'react';
import {Picker} from './PickerContainer';
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

jest.mock('./Picker.utils', () => {
    return {
        extractConfigs: () => ({
            pickerConfig: {
                picker: {
                    pickerInput: {
                        usePickerInputData: () => {
                            return {
                                fieldData: {},
                                loading: false
                            };
                        }
                    }
                }
            },
            nodeTreeConfigs: {

            }
        })
    };
});

describe('picker', () => {
    let defaultProps;

    let fastField = cmp => {
        const FastFieldRender = cmp.find('[shouldUpdate]').props().render;
        return shallowWithTheme(
            <FastFieldRender form={{setFieldValue: jest.fn(), setFieldTouched: jest.fn()}}/>,
            {},
            dsGenericTheme
        );
    };

    beforeEach(() => {
        defaultProps = {
            field: {
                displayName: 'imageid',
                name: 'imageid',
                selectorType: 'MediaPicker',
                readOnly: false
            },
            id: 'imageid',
            editorContext: {site: 'digitall'},
            setActionContext: jest.fn()
        };
    });

    it('should give to picker input readOnly', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmp.find('ReferenceCard').props().readOnly).toBe(false);
    });

    it('should close the dialog by default', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        const child = fastField(cmp);
        expect(child.find('PickerDialog').props().isOpen).toBe(false);
    });

    it('should open the dialog when clicking on the picker input', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('ReferenceCard').simulate('click');
        const child = fastField(cmp);
        expect(child.find('PickerDialog').props().isOpen).toBe(true);
    });
});
