import {selectAllAction} from './selectAll.action';

describe('selectAllAction', () => {
    describe('onclick', () => {
        it('should select all the values', () => {
            const context = {
                formik: {
                    setFieldValue: jest.fn(),
                    setFieldTouched: jest.fn(),
                    values: {
                        fieldName: ['test1', 'test2']
                    }
                },
                field: {
                    readOnly: false,
                    name: 'fieldName',
                    multiple: true,
                    valueConstraints: [{
                        displayValue: 'test 1',
                        value: {
                            string: 'test1'
                        }
                    }, {
                        displayValue: 'test 2',
                        value: {
                            string: 'test2'
                        }
                    }, {
                        displayValue: 'test 3',
                        value: {
                            string: 'test3'
                        }
                    }]
                }
            };

            selectAllAction.init(context);
            selectAllAction.onClick(context);

            // As action expect impure function, testing params
            expect(context.formik.setFieldValue).toHaveBeenCalledWith(
                'fieldName',
                ['test1', 'test2', 'test3'],
                true
            );
            expect(context.formik.setFieldTouched).toHaveBeenCalledTimes(1);
        });

        it('should not select all the values when field is disabled', () => {
            const context = {
                formik: {
                    setFieldValue: jest.fn(),
                    setFieldTouched: jest.fn(),
                    values: {
                        fieldName: ['test1', 'test2', 'test3']
                    }
                },
                field: {
                    readOnly: false,
                    name: 'fieldName',
                    multiple: true,
                    valueConstraints: [{
                        displayValue: 'test 1',
                        value: {
                            string: 'test1'
                        }
                    }, {
                        displayValue: 'test 2',
                        value: {
                            string: 'test2'
                        }
                    }, {
                        displayValue: 'test 3',
                        value: {
                            string: 'test3'
                        }
                    }]
                }
            };

            selectAllAction.init(context);
            selectAllAction.onClick(context);

            expect(context.formik.setFieldValue).not.toHaveBeenCalled();
            expect(context.formik.setFieldTouched).not.toHaveBeenCalled();
        });
    });

    describe('init', () => {
        it('should be hidden for single choicelist', () => {
            const context = {
                formik: {
                    setFieldValue: jest.fn(),
                    setFieldTouched: jest.fn()
                },
                field: {
                    name: 'fieldName',
                    multiple: false
                }
            };

            selectAllAction.init(context);

            expect(context.isVisible).toBe(false);
        });

        it('should be hidden if field is readonly', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: 'value'
                    }
                },
                field: {
                    readOnly: true,
                    name: 'yoolo',
                    multiple: true
                }
            };
            selectAllAction.init(context);

            expect(context.isVisible).toBe(false);
        });

        it('should be hidden if field has no possible value to select', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ''
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo',
                    multiple: true,
                    valueConstraints: []
                }
            };
            selectAllAction.init(context);

            expect(context.isVisible).toBe(false);
        });

        it('should be hidden if field has no valueConstraints', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ''
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo',
                    multiple: true
                }
            };
            selectAllAction.init(context);

            expect(context.isVisible).toBe(false);
        });

        it('should disabled the action if all possible field values are already selected', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ['test1', 'test2']
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo',
                    multiple: true,
                    valueConstraints: [{
                        displayValue: 'test 1',
                        value: {
                            string: 'test1'
                        }
                    }, {
                        displayValue: 'test 2',
                        value: {
                            string: 'test2'
                        }
                    }]
                }
            };
            selectAllAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should not disabled the action when no values are selected', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: null
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo',
                    multiple: true,
                    valueConstraints: [{
                        displayValue: 'test 1',
                        value: {
                            string: 'test1'
                        }
                    }, {
                        displayValue: 'test 2',
                        value: {
                            string: 'test2'
                        }
                    }, {
                        displayValue: 'test 3',
                        value: {
                            string: 'test3'
                        }
                    }]
                }
            };
            selectAllAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not disabled the action if no all possible field values are already selected', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ['test1', 'test2']
                    }
                },
                field: {
                    readOnly: false,
                    name: 'yoolo',
                    multiple: true,
                    valueConstraints: [{
                        displayValue: 'test 1',
                        value: {
                            string: 'test1'
                        }
                    }, {
                        displayValue: 'test 2',
                        value: {
                            string: 'test2'
                        }
                    }, {
                        displayValue: 'test 3',
                        value: {
                            string: 'test3'
                        }
                    }]
                }
            };
            selectAllAction.init(context);

            expect(context.enabled).toBe(true);
        });
    });
});
