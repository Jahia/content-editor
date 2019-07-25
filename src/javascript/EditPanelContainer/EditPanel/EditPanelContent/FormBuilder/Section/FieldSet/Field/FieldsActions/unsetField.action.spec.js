import {unsetFieldAction} from './unsetField.action';

describe('unsetFieldAction', () => {
    describe('onclick', () => {
        it('should set field value to null', () => {
            const context = {
                formik: {
                    setFieldValue: jest.fn()
                },
                field: {
                    name: 'fieldName'
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
                formik: {
                    values: {
                        yoolo: 'value'
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not enabled the action if field is readonly', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: 'value'
                    }
                },
                field: {
                    readOnly: true,
                    name: 'yoolo'
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should disabled the action if field value is empty', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ''
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should disabled the action if field values is empty', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: []
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should disabled the action if field values is null', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: null
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should enable the action if field values is filled', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ['value']
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            unsetFieldAction.init(context);

            expect(context.enabled).toBe(true);
        });
    });
});
