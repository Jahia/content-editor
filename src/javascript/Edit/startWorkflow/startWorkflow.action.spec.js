import React from 'react';
import {shallow} from '@jahia/test-framework';
import {Constants} from '~/ContentEditor.constants';
import startWorkflowAction from './startWorkflow.action';

describe('startWorkflow action', () => {
    let defaultProps;
    let StartWorkflowAction;

    beforeEach(() => {
        StartWorkflowAction = startWorkflowAction.component;

        window.authoringApi = {
            openPublicationWorkflow: jest.fn()
        };

        defaultProps = {
            mode: 'edit',
            parent: {
                formik: {
                    dirty: false
                }
            },
            nodeData: {
                hasPublishPermission: true,
                lockedAndCannotBeEdited: false
            },
            formik: {},
            render: jest.fn(),
            loading: undefined,
            values: {
                'WIP::Info': {
                    status: 'DISABLED'
                }
            },
            isMainButton: true,
            hasPublishPermission: true,
            lockedAndCannotBeEdited: false,
            hasStartPublicationWorkflowPermission: false,
            dirty: false,
            errors: {}
        };
    });

    it('should display startWorkflowAction when user have start workflow rights', () => {
        defaultProps.isMainButton = false;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().enabled).toBe(true);
    });

    it('should not display startWorkflowAction when user haven\'t publication rights', () => {
        defaultProps.isMainButton = false;
        defaultProps.hasPublishPermission = false;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(false);
    });

    it('should disable startWorkflowAction when form dirty', () => {
        defaultProps.dirty = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().enabled).toBe(false);
        expect(cmp.props().isVisible).toBe(true);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should disable startWorkflowAction when node locked', () => {
        defaultProps.lockedAndCannotBeEdited = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().enabled).toBe(false);
        expect(cmp.props().isVisible).toBe(true);
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
        defaultProps.hasStartPublicationWorkflowPermission = false;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().enabled).toBe(false);
    });

    it('should not display startWorkflowAction when user have publication rights', () => {
        defaultProps.hasPublishPermission = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().enabled).toBe(false);
    });

    it('should not disable request publication action when node is not locked', () => {
        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should disable request publication action when node is locked', () => {
        defaultProps.lockedAndCannotBeEdited = true;

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should disable request publication action form is WIP', () => {
        defaultProps.values[Constants.wip.fieldName].status = Constants.wip.status.LANGUAGES;
        defaultProps.values[Constants.wip.fieldName].languages = ['en', 'fr'];
        defaultProps.language = 'en';

        const cmp = shallow(<StartWorkflowAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });
});
