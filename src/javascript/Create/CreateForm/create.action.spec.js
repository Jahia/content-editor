import React, {useContext} from 'react';
import {shallow} from '@jahia/test-framework';
import createAction from './create.action';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({}))
    };
});

describe('create action', () => {
    let defaultProps;
    let CreateAction;
    beforeEach(() => {
        CreateAction = createAction.component;
        let render = jest.fn();
        useContext.mockImplementation(() => ({render}));

        defaultProps = {
            context: {
                formik: {
                    submitForm: jest.fn(() => Promise.resolve()),
                    validateForm: jest.fn(() => Promise.resolve(defaultProps.context.formik.errors)),
                    resetForm: jest.fn(),
                    setFieldValue: jest.fn(),
                    setTouched: jest.fn(() => Promise.resolve()),
                    errors: {}
                },
                renderComponent: jest.fn()
            },
            render: jest.fn(),
            loading: undefined
        };
    });

    it('should load when loading', async () => {
        defaultProps.loading = () => 'Loading';
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        expect(cmp.dive().debug()).toContain('Loading');
    });

    it('should submit form when form is valid', async () => {
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().context.onClick(defaultProps.context);
        expect(defaultProps.context.formik.submitForm).toHaveBeenCalled();
    });

    it('should not submit form when form is invalid', async () => {
        defaultProps.context.formik = {
            ...defaultProps.context.formik,
            errors: {
                myFiled1: 'required',
                myFiled2: 'required'
            }
        };
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().context.onClick(defaultProps.context);
        expect(defaultProps.context.formik.submitForm).not.toHaveBeenCalled();
    });
});
