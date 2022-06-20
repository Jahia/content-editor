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

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useEffect: cb => cb()
    };
});

describe('picker', () => {
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
            editorContext: {site: 'digitall', siteInfo: {}},
            inputContext: {
                selectorType: {
                    pickerConfig: {
                        pickerInput: {
                            usePickerInputData: () => {
                                return {
                                    fieldData: {},
                                    loading: false
                                };
                            }
                        },
                        treeConfigs: [{
                            type: 'content'
                        }]
                    }
                }
            },
            onChange: jest.fn()
        };
    });

    it('should give to picker input isReadOnly', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('ReferenceCard').props().isReadOnly).toBe(false);
    });

    it('should close the dialog by default', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('PickerDialog').props().isOpen).toBe(false);
    });

    it('should open the dialog when clicking on the picker input', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        cmp.find('ReferenceCard').simulate('click');
        expect(cmp.find('PickerDialog').props().isOpen).toBe(true);
    });
});
