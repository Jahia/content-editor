import React from 'react';
import {shallow} from '@jahia/test-framework';
import {FieldPicker} from './FieldPicker';

jest.mock('formik', () => {
    let formikvaluesmock;
    const setFieldValuemock = jest.fn();
    return {
        setFormikValues: values => {
            formikvaluesmock = values;
        },
        setFieldValue: setFieldValuemock,
        connect: Cmp => props => (
            <Cmp {...props} formik={{values: formikvaluesmock, setFieldValue: setFieldValuemock}}/>
        )
    };
});

import {setFormikValues} from 'formik';

describe('fieldPicker empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                formDefinition: {
                    name: 'fieldID',
                    readOnly: false
                }
            },
            id: 'fieldID',
            editorContext: {}
        };

        setFormikValues({fieldID: 'ojrzoij'});
    });

    it('should display the FieldPickerFilled when the field is not filled', () => {
        setFormikValues({fieldID: null});
        const cmp = shallow(<FieldPicker {...defaultProps}/>).dive();

        expect(cmp.debug()).toContain('FieldPickerEmpty');
    });

    it('should display the FieldPickerFilled when the field is filled', () => {
        const cmp = shallow(<FieldPicker {...defaultProps}/>).dive();

        expect(cmp.debug()).toContain('FieldPickerFilled');
    });

    it('should set readOnly to false if formDefinition is not set readOnly', () => {
        setFormikValues({fieldID: null});
        const cmp = shallow(<FieldPicker {...defaultProps}/>).dive();

        expect(cmp.props().readOnly).toBe(false);
    });

    it('should set readOnly to true if formDefinition is set readOnly', () => {
        setFormikValues({fieldID: null});
        defaultProps.field.formDefinition.readOnly = true;
        const cmp = shallow(<FieldPicker {...defaultProps}/>).dive();

        expect(cmp.props().readOnly).toBe(true);
    });
});
