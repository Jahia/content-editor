import React from 'react';
import {shallow} from '@jahia/test-framework';
import publishAction from './publish.action';
import {publishNode} from './publish.request';
import {Constants} from '~/ContentEditor.constants';

jest.mock('~/actions/redux.action', () => {
    let statemock;
    return {
        reduxAction: mapStateToContext => {
            return {
                init: context => {
                    const contextToAdd = mapStateToContext(statemock);
                    Object.keys(contextToAdd).forEach(key => {
                        context[key] = contextToAdd[key];
                    });
                }
            };
        },
        setReduxState: s => {
            statemock = s;
        }
    };
});

jest.mock('./publish.request', () => {
    return {
        publishNode: jest.fn()
    };
});

jest.mock('~/PublicationInfo/PublicationInfo.context', () => ({usePublicationInfoContext: jest.fn()}));

import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';

describe('publish action', () => {
    let defaultProps;
    let context;
    let PublishAction;
    let publicationStatus = 'MODIFIED';
    let publicationInfoPolling = false;
    let stopPublicationInfoPolling = jest.fn();
    let startPublicationInfoPolling = jest.fn();

    afterEach(() => {
        usePublicationInfoContext.mockClear();
        publicationStatus = 'MODIFIED';
        publicationInfoPolling = false;
        stopPublicationInfoPolling = jest.fn();
        startPublicationInfoPolling = jest.fn();
    });

    beforeEach(() => {
        PublishAction = publishAction.component;
        usePublicationInfoContext.mockImplementation(() => ({
            publicationStatus: publicationStatus,
            publicationInfoPolling: publicationInfoPolling,
            stopPublicationInfoPolling: stopPublicationInfoPolling,
            startPublicationInfoPolling: startPublicationInfoPolling
        }));

        context = {
            nodeData: {
                hasPublishPermission: true,
                lockedAndCannotBeEdited: false
            },
            formik: {
                dirty: false,
                values: {
                    'WIP::Info': {
                        status: 'DISABLED'
                    }
                }
            },
            publicationInfoContext: {
                publicationStatus: 'MODIFIED',
                publicationInfoPolling: false,
                startPublicationInfoPolling: jest.fn(),
                stopPublicationInfoPolling: jest.fn()
            }
        };

        defaultProps = {
            context,
            render: jest.fn(),
            loading: undefined,
            values: {
                'WIP::Info': {
                    status: 'DISABLED'
                }
            },
            hasPublishPermission: true,
            lockedAndCannotBeEdited: false,
            dirty: false,
            errors: {}
        };
    });

    it('should disabled submit action when form is dirty', () => {
        defaultProps.dirty = true;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should disabled submit action when node is in WIP for all content', () => {
        defaultProps.values[Constants.wip.fieldName].status = Constants.wip.status.ALL_CONTENT;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should disabled submit action when node is in WIP for current language', () => {
        defaultProps.values[Constants.wip.fieldName].status = Constants.wip.status.LANGUAGES;
        defaultProps.values[Constants.wip.fieldName].languages = ['en', 'fr'];
        context.language = 'en';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should disabled submit action when publication info are not loaded', () => {
        publicationStatus = undefined;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should disabled submit action when we are polling publication info', () => {
        publicationInfoPolling = true;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should stop polling if we are polling and node is published', () => {
        publicationStatus = 'PUBLISHED';
        publicationInfoPolling = true;

        shallow(<PublishAction {...defaultProps}/>);
        expect(stopPublicationInfoPolling).toHaveBeenCalled();
    });

    it('should not stop polling if we are polling and node is not published', () => {
        publicationInfoPolling = true;

        shallow(<PublishAction {...defaultProps}/>);
        expect(stopPublicationInfoPolling).not.toHaveBeenCalled();
    });

    it('should not disabled submit action when node is not already published', () => {
        publicationStatus = 'NOT_PUBLISHED';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(false);
    });

    it('should disabled submit action when node is already published', () => {
        publicationStatus = 'PUBLISHED';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should disabled submit action when node is UNPUBLISHABLE', () => {
        publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should display publish action when you have the proper permission and it is edit mode', () => {
        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.enabled).toBe(true);
    });

    it('should use label when polling is OFF', () => {
        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.name');
    });

    it('should use polling label when polling is ON', () => {
        publicationInfoPolling = true;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.namePolling');
    });

    it('should undisplay publish action when you haven\'t the proper permission', () => {
        defaultProps.hasPublishPermission = false;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.enabled).toBe(false);
    });

    it('should disable publish action when node is locked', () => {
        defaultProps.lockedAndCannotBeEdited = true;

        const cmp = shallow(<PublishAction {...defaultProps}/>);
        expect(cmp.props().context.disabled).toBe(true);
    });

    it('should call publishNode request', () => {
        const cmp = shallow(<PublishAction {...defaultProps}/>);
        cmp.props().context.onClick(context);

        expect(publishNode).toHaveBeenCalled();
        expect(startPublicationInfoPolling).toHaveBeenCalled();
    });
});
