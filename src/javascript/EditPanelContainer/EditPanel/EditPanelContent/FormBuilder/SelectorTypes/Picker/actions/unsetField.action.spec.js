import {unsetFieldAction} from './unsetField.action';

describe('unsetFieldAction', () => {
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
            expect(context.formik.setFieldValue).toHaveBeenCalledWith(
                'fieldName',
                null,
                true
            );
        });
    });

    describe('init', () => {
        it('should enabled the action if field is not readonly', () => {
            const context = {
                field: {
                    formDefinition: {
                        readOnly: false
                    }
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not enabled the action if field is readonly', () => {
            const context = {
                field: {
                    formDefinition: {
                        readOnly: true
                    }
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(false);
        });
    });
});
