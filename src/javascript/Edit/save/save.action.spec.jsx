import React, {useContext} from 'react';
import {shallow} from '@jahia/test-framework';
import saveAction from './save.action';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import {useContentEditorContext} from '~/ContentEditor.context';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({}))
    };
});

jest.mock('~/PublicationInfo/PublicationInfo.context', () => ({usePublicationInfoContext: jest.fn()}));

jest.mock('~/ContentEditor.context', () => ({useContentEditorContext: jest.fn()}));

describe('save action', () => {
    let SaveAction;
    let defaultProps;
    let render = jest.fn();

    beforeEach(() => {
        SaveAction = saveAction.component;
        useContext.mockImplementation(() => ({render}));
        useContentEditorContext.mockImplementation(() => ({refetchFormData: jest.fn()}));
        usePublicationInfoContext.mockImplementation(() => ({publicationInfoPolling: jest.fn()}));
        defaultProps = {
            formik: {
                submitForm: jest.fn(() => Promise.resolve()),
                resetForm: jest.fn(() => Promise.resolve()),
                setFieldValue: jest.fn(),
                setTouched: jest.fn(() => Promise.resolve()),
                validateForm: jest.fn(() => Promise.resolve(defaultProps.errors)),
                dirty: true,
                errors: {}
            },
            renderComponent: jest.fn(), render, loading: undefined, dirty: true,
            errors: {}
        };
    });

    it('should load when loading', async () => {
        defaultProps.loading = () => 'Loading';
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        expect(cmp.dive().debug()).toContain('Loading');
    });

    it('should submit form when form is valid', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);
        expect(defaultProps.formik.submitForm).toHaveBeenCalled();
    });

    it('shouldn\'t do anything when form is not dirty', async () => {
        defaultProps.dirty = false;
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBeTruthy();
    });

    it('should submitForm', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(defaultProps.formik.submitForm).toHaveBeenCalled();
    });

    it('should resetForm when submitting', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(defaultProps.formik.resetForm).toHaveBeenCalled();
    });

    it('shouldn\'t call resetForm when submitForm ', async () => {
        defaultProps.formik.submitForm = jest.fn(() => Promise.reject());
        try {
            const cmp = shallow(<SaveAction {...defaultProps}/>);
            await cmp.props().onClick(defaultProps);
        } catch (_) {
        }

        expect(defaultProps.formik.resetForm).not.toHaveBeenCalled();
    });

    it('should show a modal when form have errors', async () => {
        defaultProps.errors = {
            field1: 'required'
        };

        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(render).toHaveBeenCalled();
    });
});
