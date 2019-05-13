import {mediaPickerUnsetAction} from './MediaPicker.actions';

describe('mediaPickerUnsetAction', () => {
    describe('onclick', () => {
        it('should set field value to null', () => {
            const context = {
                formik: {
                    setFieldValue: jest.fn()
                },
                field: {
                    formDefinition: {
                        name: 'fieldName'
                    }
                }
            };

            mediaPickerUnsetAction.onClick(context);

            // As action expect impure function, testing params
            expect(context.formik.setFieldValue).toHaveBeenCalledWith('fieldName', null, true);
        });
    });
    describe('init', () => {
        it('should enable action on editable mode', () => {
            const context = {
                field: {
                    formDefinition: {
                        readOnly: false
                    }
                }
            };

            mediaPickerUnsetAction.init(context, {formik: {}});

            expect(context.enabled).toBe(true);
        });

        it('should not enable action on readOnly mode', () => {
            const context = {
                field: {
                    formDefinition: {
                        readOnly: true
                    }
                }
            };

            mediaPickerUnsetAction.init(context, {formik: {}});

            expect(context.enabled).toBe(false);
        });
    });
});
