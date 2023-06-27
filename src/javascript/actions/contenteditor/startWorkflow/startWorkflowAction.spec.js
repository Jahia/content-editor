import React from 'react';
import {shallow} from '@jahia/test-framework';
import {Constants} from '~/ContentEditor.constants';
import {startWorkflowAction} from './startWorkflowAction';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';

jest.mock('formik');
jest.mock('~/contexts/ContentEditor/ContentEditor.context');
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context');

describe('startWorkflow action', () => {
    let formik;
    let defaultProps;
    let contentEditorContext;
    let contentEditorConfigContext;
    let StartWorkflowAction;

    beforeEach(() => {
        StartWorkflowAction = startWorkflowAction.component;

        window.authoringApi = {
            openPublicationWorkflow: jest.fn()
        };

        defaultProps = {
            render: jest.fn(),
            loading: undefined,
            isMainButton: true
        };
        formik = {
            dirty: false,
            values: {
                'WIP::Info': {
                    status: 'DISABLED'
                }
            },
            errors: {}
        };
        useFormikContext.mockReturnValue(formik);
        contentEditorContext = {
            i18nContext: {},
            nodeData: {
                hasPublishPermission: true,
                lockedAndCannotBeEdited: false,
                hasStartPublicationWorkflowPermission: false
            }
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
        contentEditorConfigContext = {};
        useContentEditorConfigContext.mockReturnValue(contentEditorConfigContext);
    });

    it('should display startWorkflowAction when user have start workflow rights', () => {
        defaultProps.isMainButton = false;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(true);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should not display startWorkflowAction when user haven\'t publication rights', () => {
        defaultProps.isMainButton = false;
        contentEditorContext.nodeData.hasPublishPermission = false;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(false);
    });

    it('should disable startWorkflowAction when form dirty', () => {
        formik.dirty = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(false);
    });

    it('should disable startWorkflowAction when node locked', () => {
        contentEditorContext.nodeData.lockedAndCannotBeEdited = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(false);
    });

    it('should call GWT command', () => {
        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        cmp.props().onClick({
            nodeData: {uuid: 'hello'},
            enabled: true
        });

        expect(window.authoringApi.openPublicationWorkflow).toHaveBeenCalled();
    });

    it('should not display startWorkflowAction when user doesn\'t have start workflow right', () => {
        contentEditorContext.nodeData.hasStartPublicationWorkflowPermission = false;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(false);
    });

    it('should not display startWorkflowAction when user have publication rights', () => {
        contentEditorContext.nodeData.hasPublishPermission = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(false);
    });

    it('should not disable request publication action when node is not locked', () => {
        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should disable request publication action when node is locked', () => {
        contentEditorContext.nodeData.lockedAndCannotBeEdited = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should disable request publication action form is WIP', () => {
        formik.values[Constants.wip.fieldName].status = Constants.wip.status.LANGUAGES;
        formik.values[Constants.wip.fieldName].languages = ['en', 'fr'];
        contentEditorContext.lang = 'en';

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });
});
