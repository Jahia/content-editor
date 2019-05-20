import {unsetFieldAction} from './unsetFieldAction';

describe('unsetFieldPickerAction', () => {
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

            unsetFieldAction.onClick(context);

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

            unsetFieldAction.init(context, {formik: {}});

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

            unsetFieldAction.init(context, {formik: {}});

            expect(context.enabled).toBe(false);
        });
    });
});
