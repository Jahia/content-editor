import React, {useContext} from 'react';
import {shallow} from '@jahia/test-framework';
import createAction from './create.action';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';

jest.mock('formik');
jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({}))
    };
});

jest.mock('~/ContentEditor.context', () => ({useContentEditorContext: jest.fn(), useContentEditorConfigContext: jest.fn()}));

describe('create action', () => {
    let defaultProps;
    let formik;
    let CreateAction;
    beforeEach(() => {
        CreateAction = createAction.component;
        let render = jest.fn();
        useContext.mockImplementation(() => ({render}));
        useContentEditorContext.mockImplementation(() => ({mode: jest.fn()}));
        useContentEditorConfigContext.mockImplementation(() => ({envProps: {}}));

        defaultProps = {
            renderComponent: jest.fn(),
            render: jest.fn(),
            loading: undefined
        };
        formik = {
            submitForm: jest.fn(() => Promise.resolve()),
            validateForm: jest.fn(() => Promise.resolve(formik.errors)),
            resetForm: jest.fn(),
            setFieldValue: jest.fn(),
            setTouched: jest.fn(() => Promise.resolve()),
            errors: {}
        };
        useFormikContext.mockReturnValue(formik);
    });

    it('should load when loading', async () => {
        defaultProps.loading = () => 'Loading';
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        expect(cmp.dive().debug()).toContain('Loading');
    });

    it('should submit form when form is valid', async () => {
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);
        expect(formik.submitForm).toHaveBeenCalled();
    });

    it('should not submit form when form is invalid', async () => {
        formik.errors = {
            myFiled1: 'required',
            myFiled2: 'required'
        };
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);
        expect(formik.submitForm).not.toHaveBeenCalled();
    });

    it('should not be a disabled action when is not clicked', async () => {
        const cmp = shallow(<CreateAction {...defaultProps}/>);

        expect(cmp.props().disabled).toBe(false);
    });

    it('should not be a disabled action when is clicked, but form is dirty', async () => {
        formik.dirty = true;
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
