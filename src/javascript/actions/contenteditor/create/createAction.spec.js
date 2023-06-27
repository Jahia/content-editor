import React, {useContext} from 'react';
import {shallow} from '@jahia/test-framework';
import {createAction} from './createAction';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext, useContentEditorSectionContext} from '~/contexts';

jest.mock('formik');
jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({})),
        useState: jest.fn()
    };
});

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => ({
    useContentEditorContext: jest.fn()
}));
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context', () => ({
    useContentEditorConfigContext: jest.fn()
}));
jest.mock('~/contexts/ContentEditorSection/ContentEditorSection.context');

describe('create action', () => {
    let defaultProps;
    let formik;
    let CreateAction;
    const setState = jest.fn();
    const useStateMock = initState => [initState, setState];
    let sections = [{
        fieldSets: [{
            fields: [
                {name: 'field1'},
                {name: 'field2'}
            ]
        }]
    }];

    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    beforeEach(() => {
        CreateAction = createAction.component;
        let render = jest.fn();
        useContext.mockImplementation(() => ({render}));
        useContentEditorContext.mockImplementation(() => ({
            mode: jest.fn(),
            setErrors: jest.fn(),
            refetchFormData: jest.fn(() => Promise.resolve({})),
            i18nContext: {},
            setI18nContext: jest.fn(),
            resetI18nContext: jest.fn()
        }));
        useContentEditorConfigContext.mockImplementation(() => ({
            onSavedCallback: () => {}
        }));
        useContentEditorSectionContext.mockReturnValue({sections});

        defaultProps = {
            renderComponent: jest.fn(),
            render: jest.fn(),
            loading: undefined
        };
        formik = {
            submitForm: jest.fn(() => Promise.resolve({})),
            validateForm: jest.fn(() => Promise.resolve(formik.errors)),
            resetForm: jest.fn(),
            setFieldValue: jest.fn(),
            setTouched: jest.fn(() => Promise.resolve()),
            errors: {}
        };
        useFormikContext.mockReturnValue(formik);
    });

    afterEach(() => {
        jest.clearAllMocks();
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
            field1: 'required',
            field2: 'required'
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

        expect(setState).toHaveBeenNthCalledWith(1, true);
    });

    it('should disable action when is clicked', async () => {
        formik.dirty = false;
        const cmp = shallow(<CreateAction {...defaultProps}/>);
        await cmp.props().onClick(defaultProps);

        expect(setState).toHaveBeenNthCalledWith(1, true);
    });
});
