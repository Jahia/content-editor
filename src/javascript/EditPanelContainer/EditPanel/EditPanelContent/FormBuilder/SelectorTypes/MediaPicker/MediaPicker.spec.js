import React from 'react';
import {shallow} from '@jahia/test-framework';
import {MediaPicker} from './MediaPicker';

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

import {setFormikValues, setFieldValue} from 'formik';

describe('mediaPicker empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                formDefinition: {
                    name: 'imageid'
                }
            },
            id: 'imageid',
            editorContext: {}
        };

        setFormikValues({imageid: 'ojrzoij'});
    });

    it('should display the MediaPickerFilled when the field is filed', () => {
        setFormikValues({imageid: null});
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        expect(cmp.debug()).toContain('MediaPickerEmpty');
    });

    it('should set formik value when image is Selected', () => {
        setFormikValues({imageid: null});
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        cmp.simulate('imageSelection', [{uuid: 'img'}]);

        expect(setFieldValue).toHaveBeenCalledWith('imageid', 'img', true);
    });

    it('should display the MediaPickerFilled when the field is filed', () => {
        const cmp = shallow(<MediaPicker {...defaultProps}/>).dive();

        expect(cmp.debug()).toContain('MediaPickerFilled');
    });
});
