import React from 'react';
import {UnsetFieldActionComponent} from './unsetField.action';
import {shallow} from '@jahia/test-framework';

const button = () => <button type="button"/>;

describe('unsetFieldAction', () => {
    describe('onclick', () => {
        let context;
        beforeEach(() => {
            context = {
                formik: {
                    values: {
                        fieldName: ['old']
                    },
                    setFieldValue: jest.fn(),
                    setFieldTouched: jest.fn()
                },
                inputContext: {
                    actionContext: {}
                },
                field: {
                    name: 'fieldName'
                },
                enabled: true
            };
        });

        it('should set field value to null', () => {
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);
            cmp.simulate('click');

            // As action expect impure function, testing params
            expect(context.formik.setFieldValue).toHaveBeenCalledWith(
                'fieldName',
                null,
                true
            );
        });

        it('should set field touched', () => {
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);
            cmp.simulate('click');

            expect(context.formik.setFieldTouched).toHaveBeenCalledWith('fieldName');
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
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(true);
        });

        it('should not enabled the action if field is readonly', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: 'value'
                    }
                },
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: true,
                    name: 'yoolo'
                }
            };
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(false);
        });

        it('should disabled the action if field value is empty', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ''
                    }
                },
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(false);
        });

        it('should disabled the action if field values is empty', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: []
                    }
                },
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(false);
        });

        it('should disabled the action if field values is null', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: null
                    }
                },
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(false);
        });

        it('should enable the action if field values is filled', () => {
            const context = {
                formik: {
                    values: {
                        yoolo: ['value']
                    }
                },
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: false,
                    name: 'yoolo'
                }
            };
            const cmp = shallow(<UnsetFieldActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(true);
        });
    });
});
