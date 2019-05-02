import {mediaPickerUnsetAction} from './MediaPicker.actions';

describe('mediaPickerUnsetAction', () => {
    describe('onclick', () => {
        it('should not display anything when form is at his initialValues', () => {
            const context = {
                formik: {
                    setFieldValue: jest.fn()
                },
                field: {
                    data: {
                        name: 'fieldName'
                    }
                }
            };

            mediaPickerUnsetAction.onClick(context);

            // As action expect impure function, testing params
            expect(context.formik.setFieldValue).toHaveBeenCalledWith('fieldName', null, true);
        });
    });
});
