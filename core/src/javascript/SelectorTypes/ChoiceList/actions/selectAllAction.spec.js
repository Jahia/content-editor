import {SelectAllActionComponent} from './selectAllAction';
import {shallow} from '@jahia/test-framework';
import React from 'react';
import {useFormikContext} from 'formik';

jest.mock('formik');

const button = () => <button type="button"/>;
describe('selectAllAction', () => {
    describe('onclick', () => {
        it('should select all the values', () => {
            const formik = {
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn(),
                values: {
                    fieldName: ['test1', 'test2']
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
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

            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);
            cmp.simulate('click');

            // As action expect impure function, testing params
            expect(formik.setFieldValue).toHaveBeenCalledWith(
                'fieldName',
                ['test1', 'test2', 'test3'],
                true
            );
            expect(formik.setFieldTouched).toHaveBeenCalledTimes(1);
        });

        it('should not select all the values when field is disabled', () => {
            const formik = {
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn(),
                values: {
                    fieldName: ['test1', 'test2', 'test3']
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
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

            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);
            cmp.simulate('click');

            expect(formik.setFieldValue).not.toHaveBeenCalled();
            expect(formik.setFieldTouched).not.toHaveBeenCalled();
        });
    });

    describe('init', () => {
        it('should be hidden for single choicelist', () => {
            const formik = {
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn()
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
                },
                field: {
                    name: 'fieldName',
                    multiple: false
                }
            };

            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);

            expect(cmp).toEqual({});
        });

        it('should be hidden if field is readonly', () => {
            const formik = {
                values: {
                    yoolo: 'value'
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: true,
                    name: 'yoolo',
                    multiple: true
                }
            };
            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);

            expect(cmp).toEqual({});
        });

        it('should be hidden if field has no possible value to select', () => {
            const formik = {
                values: {
                    yoolo: ''
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: false,
                    name: 'yoolo',
                    multiple: true,
                    valueConstraints: []
                }
            };
            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);

            expect(cmp).toEqual({});
        });

        it('should be hidden if field has no valueConstraints', () => {
            const formik = {
                values: {
                    yoolo: ''
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
                },
                field: {
                    readOnly: false,
                    name: 'yoolo',
                    multiple: true
                }
            };
            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);

            expect(cmp).toEqual({});
        });

        it('should disabled the action if all possible field values are already selected', () => {
            const formik = {
                values: {
                    yoolo: ['test1', 'test2']
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
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
            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(false);
        });

        it('should not disabled the action when no values are selected', () => {
            const formik = {
                values: {
                    yoolo: null
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
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
            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(true);
        });

        it('should not disabled the action if no all possible field values are already selected', () => {
            const formik = {
                values: {
                    yoolo: ['test1', 'test2']
                }
            };
            useFormikContext.mockReturnValue(formik);
            const context = {
                inputContext: {
                    actionContext: {}
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
            const cmp = shallow(<SelectAllActionComponent {...context} render={button}/>);

            expect(cmp.props().enabled).toBe(true);
        });
    });
});
