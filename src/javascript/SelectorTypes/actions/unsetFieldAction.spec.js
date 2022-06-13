import React from 'react';
import {UnsetFieldActionComponent} from './unsetFieldAction';
import {shallow} from '@jahia/test-framework';
import {useFormikContext} from 'formik';

jest.mock('formik');

const button = () => <button type="button"/>;

describe('unsetFieldAction', () => {
    let defaultProps;
    let formik;
    beforeEach(() => {
        defaultProps = {
            inputContext: {
                actionContext: {}
            },
            field: {
                name: 'fieldName'
            },
            enabled: true
        };
        formik = {
            values: {
                fieldName: ['old']
            },
            setFieldValue: jest.fn(),
            setFieldTouched: jest.fn()
        };
        useFormikContext.mockReturnValue(formik);
    });

    describe('onclick', () => {
        it('should set field value to null', () => {
            const cmp = shallow(<UnsetFieldActionComponent {...defaultProps} render={button}/>);
            cmp.simulate('click');

            // As action expect impure function, testing params
            expect(formik.setFieldValue).toHaveBeenCalledWith(
                'fieldName',
                null,
                true
            );
        });

        it('should set field touched', () => {
            const cmp = shallow(<UnsetFieldActionComponent {...defaultProps} render={button}/>);
            cmp.simulate('click');

            expect(formik.setFieldTouched).toHaveBeenCalledWith('fieldName');
        });
    });

    describe('init', () => {
        it('should enabled the action if field is not readonly', () => {
            formik.values = {
                yoolo: 'value'
            };
            const context = {
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
            formik.values = {
                yoolo: 'value'
            };
            const context = {
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
            formik.values = {
                yoolo: ''
            };
            const context = {
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
            formik.values = {
                yoolo: []
            };
            const context = {
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
            formik.values = {
                yoolo: null
            };
            const context = {
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
            formik.values = {
                yoolo: ['value']
            };
            const context = {
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
