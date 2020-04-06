import React, {useContext} from 'react';
import {shallow} from '@jahia/test-framework';
import saveAction from './save.action';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({}))
    };
});

jest.mock('~/PublicationInfo/PublicationInfo.context', () => ({usePublicationInfoContext: jest.fn()}));

describe('save action', () => {
    let context;
    let SaveAction;
    let defaultProps;
    let render = jest.fn();

    beforeEach(() => {
        SaveAction = saveAction.component;
        useContext.mockImplementation(() => ({render}));
        usePublicationInfoContext.mockImplementation(() => ({publicationInfoPolling: jest.fn()}));
        context = {
            formik: {
                submitForm: jest.fn(() => Promise.resolve()),
                resetForm: jest.fn(() => Promise.resolve()),
                setFieldValue: jest.fn(),
                setTouched: jest.fn(() => Promise.resolve()),
                validateForm: jest.fn(() => Promise.resolve(context.formik.errors)),
                dirty: true,
                errors: {}
            },
            renderComponent: jest.fn()
        };
        defaultProps = {context, render, loading: undefined};
    });

    it('should load when loading', async () => {
        defaultProps.loading = () => 'Loading';
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        expect(cmp.dive().debug()).toContain('Loading');
    });

    it('should submit form when form is valid', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().context.onClick(context);
        expect(context.formik.submitForm).toHaveBeenCalled();
    });

    it('shouldn\'t do anything when form is not dirty', async () => {
        context.formik.dirty = false;
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBeTruthy();
    });

    it('should submitForm', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().context.onClick(context);

        expect(context.formik.submitForm).toHaveBeenCalled();
    });

    it('should resetForm when submitting', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().context.onClick(context);

        expect(context.formik.resetForm).toHaveBeenCalled();
    });

    it('shouldn\'t call resetForm when submitForm ', async () => {
        context.formik.submitForm = jest.fn(() => Promise.reject());
        try {
            const cmp = shallow(<SaveAction {...defaultProps}/>);
            await cmp.props().context.onClick(context);
        } catch (_) {
        }

        expect(context.formik.resetForm).not.toHaveBeenCalled();
    });

    it('should show a modal when form have errors', async () => {
        context.formik.errors = {
            field1: 'required'
        };

        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().context.onClick(context);

        expect(render).toHaveBeenCalled();
    });
});
