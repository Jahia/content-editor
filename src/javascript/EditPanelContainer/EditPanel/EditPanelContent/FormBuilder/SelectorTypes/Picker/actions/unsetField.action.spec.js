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
            expect(context.formik.setFieldValue).toHaveBeenCalledWith('fieldName', null, true);
        });
    });
});
