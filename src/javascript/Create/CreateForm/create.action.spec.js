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
            formik: {
                submitForm: jest.fn(() => Promise.resolve()),
                validateForm: jest.fn(() => Promise.resolve(defaultProps.errors)),
                resetForm: jest.fn(),
                setFieldValue: jest.fn(),
                setTouched: jest.fn(() => Promise.resolve())
            },
            renderComponent: jest.fn(),
            errors: {},
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
        await cmp.props().onClick(defaultProps);
        expect(defaultProps.formik.submitForm).toHaveBeenCalled();
    });

    it('should not submit form when form is invalid', async () => {
        defaultProps.errors = {
            myFiled1: 'required',
            myFiled2: 'required'
        };
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);
        expect(defaultProps.formik.submitForm).not.toHaveBeenCalled();
    });

    it('should not be a disabled action when is not clicked', async () => {
        const cmp = shallow(<CreateAction {...defaultProps}/>);

        expect(cmp.props().disabled).toBe(false);
    });

    it('should not be a disabled action when is clicked, but form is dirty', async () => {
        defaultProps.dirty = true;
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(cmp.props().disabled).toBe(false);
    });

    it('should disable action when is clicked', async () => {
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(cmp.props().disabled).toBe(true);
    });
});
