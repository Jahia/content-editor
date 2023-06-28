import React, {useContext} from 'react';
import {shallow} from '@jahia/test-framework';
import {saveAction} from './saveAction';
import {usePublicationInfoContext} from '~/contexts/PublicationInfo';
import {useContentEditorConfigContext, useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {useFormikContext} from 'formik';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({}))
    };
});

jest.mock('~/contexts/PublicationInfo', () => ({usePublicationInfoContext: jest.fn()}));
jest.mock('~/contexts/ContentEditorSection');
jest.mock('formik');
jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => ({
    useContentEditorContext: jest.fn()
}));
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context', () => ({
    useContentEditorConfigContext: jest.fn()
}));

describe('save action', () => {
    let SaveAction;
    let defaultProps;
    let formik;
    let render = jest.fn();
    let sections = [{
        fieldSets: [{
            fields: [
                {name: 'field1'},
                {name: 'field2'}
            ]
        }]
    }];

    beforeEach(() => {
        SaveAction = saveAction.component;
        useContext.mockImplementation(() => ({render}));
        const contentEditorContext = {
            i18nContext: {
                en: {
                    validation: {},
                    values: {}
                }
            },
            setI18nContext: jest.fn(),
            resetI18nContext: jest.fn(),
            refetchFormData: jest.fn(),
            setErrors: jest.fn()
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
        const contentEditorConfigContext = {
            onSavedCallback: () => {}
        };
        useContentEditorSectionContext.mockReturnValue({sections});
        useContentEditorConfigContext.mockReturnValue(contentEditorConfigContext);
        usePublicationInfoContext.mockImplementation(() => ({publicationInfoPolling: jest.fn()}));
        defaultProps = {
            renderComponent: jest.fn(), render, loading: undefined, dirty: true
        };
        formik = {
            submitForm: jest.fn(() => Promise.resolve({})),
            resetForm: jest.fn(() => Promise.resolve()),
            setFieldValue: jest.fn(),
            setTouched: jest.fn(() => Promise.resolve()),
            validateForm: jest.fn(() => Promise.resolve(formik.errors)),
            dirty: true,
            errors: {}
        };
        useFormikContext.mockReturnValue(formik);
    });

    it('should load when loading', async () => {
        defaultProps.loading = () => 'Loading';
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        expect(cmp.dive().debug()).toContain('Loading');
    });

    it('should submit form when form is valid', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);
        expect(formik.submitForm).toHaveBeenCalled();
    });

    it('shouldn\'t do anything when form is not dirty', async () => {
        formik.dirty = false;
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBeTruthy();
    });

    it('should submitForm', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(formik.submitForm).toHaveBeenCalled();
    });

    it('should resetForm when submitting', async () => {
        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(formik.resetForm).toHaveBeenCalled();
    });

    it('shouldn\'t call resetForm when submitForm ', async () => {
        formik.submitForm = jest.fn(() => Promise.reject());
        try {
            const cmp = shallow(<SaveAction {...defaultProps}/>);
            await cmp.props().onClick(defaultProps);
        } catch (_) {
        }

        expect(formik.resetForm).not.toHaveBeenCalled();
    });

    it('should show a modal when form have errors', async () => {
        formik.errors = {
            field1: 'required'
        };

        const cmp = shallow(<SaveAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(render).toHaveBeenCalled();
    });
});
