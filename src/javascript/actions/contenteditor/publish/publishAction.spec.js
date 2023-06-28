import React from 'react';
import {shallow} from '@jahia/test-framework';
import {publishAction} from './publishAction';
import {Constants} from '~/ContentEditor.constants';
import {usePublicationInfoContext} from '~/contexts/PublicationInfo';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import {useFormikContext} from 'formik';

jest.mock('./publishNode', () => {
    return {
        publishNode: jest.fn()
    };
});

jest.mock('~/contexts/PublicationInfo', () => ({usePublicationInfoContext: jest.fn()}));
jest.mock('~/contexts/ContentEditor/ContentEditor.context');
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context');
jest.mock('formik');
jest.mock('@apollo/react-hooks');

describe('publish action', () => {
    let defaultProps;
    let formikContext;
    let contentEditorContext;
    let contentEditorConfigContext;
    let publicationInfoContext;
    let PublishAction;

    beforeEach(() => {
        PublishAction = publishAction.component;
        publicationInfoContext = {
            publicationStatus: 'MODIFIED',
            publicationInfoPolling: false,
            stopPublicationInfoPolling: jest.fn(),
            startPublicationInfoPolling: jest.fn()
        };
        usePublicationInfoContext.mockReturnValue(publicationInfoContext);
        formikContext = {
            dirty: false,
            values: {
                'WIP::Info': {
                    status: 'DISABLED'
                }
            },
            errors: {}
        };
        useFormikContext.mockReturnValue(formikContext);
        contentEditorContext = {
            i18nContext: {},
            nodeData: {
                hasPublishPermission: true,
                lockedAndCannotBeEdited: false
            }
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
        contentEditorConfigContext = {};
        useContentEditorConfigContext.mockReturnValue(contentEditorConfigContext);

        defaultProps = {
            render: jest.fn(),
            loading: undefined
        };
    });

    it('should disabled submit action when form is dirty', () => {
        contentEditorContext.i18nContext.en = {
            validation: {},
            values: {}
        };

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should disabled submit action when node is in WIP for all content', () => {
        formikContext.values[Constants.wip.fieldName].status = Constants.wip.status.ALL_CONTENT;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should disabled submit action when node is in WIP for current language', () => {
        formikContext.values[Constants.wip.fieldName].status = Constants.wip.status.LANGUAGES;
        formikContext.values[Constants.wip.fieldName].languages = ['en', 'fr'];
        contentEditorContext.lang = 'en';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should disabled submit action when publication info are not loaded', () => {
        publicationInfoContext.publicationStatus = undefined;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should disabled submit action when we are polling publication info', () => {
        publicationInfoContext.publicationInfoPolling = true;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should stop polling if we are polling and node is published', () => {
        publicationInfoContext.publicationStatus = 'PUBLISHED';
        publicationInfoContext.publicationInfoPolling = true;

        shallow(<PublishAction {...defaultProps}/>);
        expect(publicationInfoContext.stopPublicationInfoPolling).toHaveBeenCalled();
    });

    it('should not stop polling if we are polling and node is not published', () => {
        publicationInfoContext.publicationInfoPolling = true;

        shallow(<PublishAction {...defaultProps}/>);
        expect(publicationInfoContext.stopPublicationInfoPolling).not.toHaveBeenCalled();
    });

    it('should not disabled submit action when node is not already published', () => {
        publicationInfoContext.publicationStatus = 'NOT_PUBLISHED';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should disabled submit action when node is already published', () => {
        publicationInfoContext.publicationStatus = 'PUBLISHED';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should disabled submit action when node is UNPUBLISHABLE', () => {
        publicationInfoContext.publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });

    it('should display publish action when you have the proper permission and it is edit mode', () => {
        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(true);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should use label when polling is OFF', () => {
        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.name');
    });

    it('should use polling label when polling is ON', () => {
        publicationInfoContext.publicationInfoPolling = true;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.namePolling');
    });

    it('should undisplay publish action when you haven\'t the proper permission', () => {
        contentEditorContext.nodeData.hasPublishPermission = false;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().isVisible).toBe(false);
    });

    it('should disable publish action when node is locked', () => {
        contentEditorContext.nodeData.lockedAndCannotBeEdited = true;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().disabled).toBe(true);
    });
});
