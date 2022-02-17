import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {shallow} from '@jahia/test-framework';

import {push} from 'connected-react-router';
import {cmGoto} from '~/JContent.redux-actions';
import {useContentEditorConfigContext} from '~/ContentEditor.context';

import {GetContentPath} from './ContentPath.gql-queries';
import ContentPathContainer from './ContentPath.container';
import {Constants} from '~/ContentEditor.constants';

jest.mock('connected-react-router', () => ({
    push: jest.fn()
}));

jest.mock('~/JContent.redux-actions', () => ({
    cmGoto: jest.fn()
}));

jest.mock('~/ContentEditor.context', () => ({
    useContentEditorConfigContext: jest.fn()
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn().mockReturnValue({})
}));

describe('ContentPathContainer', () => {
    let defaultProps;

    let dispatch = jest.fn();
    let envProps = {
        back: jest.fn(),
        shouldRedirectBeadCrumb: () => false
    };

    beforeEach(() => {
        defaultProps = {
            formik: {
                dirty: false
            },
            uuid: '123',
            operator: 'op'
        };

        useSelector.mockImplementation(callback => callback({
            language: 'fr'
        }));

        useContentEditorConfigContext.mockImplementation(() => ({
            envProps: envProps,
            site: 'mySiteXD'
        }));

        useDispatch.mockImplementation(() => dispatch);
    });

    afterEach(() => {
        dispatch = jest.fn();
        envProps = {
            back: jest.fn(),
            shouldRedirectBeadCrumb: () => false
        };

        useQuery.mockClear();
        useDispatch.mockClear();
        useSelector.mockClear();
    });

    it('uses expected query parameters', () => {
        shallow(<ContentPathContainer path="/x/y/z" {...defaultProps}/>);

        expect(useQuery).toHaveBeenCalledWith(GetContentPath, {
            variables: {
                path: '/x/y/z',
                language: 'fr'
            }
        });
    });

    it('renders correctly', () => {
        const ancestors = [
            {uuid: 'x', path: '/x'},
            {uuid: 'y', path: '/x/y'}
        ];

        useQuery.mockImplementation(() => ({
            data: {
                jcr: {
                    node: {
                        ancestors: ancestors
                    }
                }
            }
        }));

        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        expect(wrapper.find('ContentPath').prop('items')).toEqual(ancestors);
        expect(wrapper.find('ContentPath').prop('onItemClick')).toBeDefined();
    });

    it('starts from the closest ancestor visible in Content tree if node is not visible Content tree', () => {
        const ancestors = [{
            uuid: 'x',
            path: '/x',
            isVisibleInContentTree: true
        }, {
            uuid: 'y',
            path: '/x/y',
            isVisibleInContentTree: true
        }, {
            uuid: 'z',
            path: '/x/y/z',
            isVisibleInContentTree: false
        }];

        useQuery.mockImplementation(() => ({
            data: {
                jcr: {
                    node: {
                        isVisibleInContentTree: false,
                        ancestors: ancestors
                    }
                }
            }
        }));

        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        expect(wrapper.find('ContentPath').prop('items')).toEqual(ancestors.slice(1));
    });

    it('should display direct parent when in create mode', () => {
        const ancestors = [{
            uuid: 'x',
            path: '/x',
            isVisibleInContentTree: true
        }, {
            uuid: 'y',
            path: '/x/y',
            isVisibleInContentTree: true
        }, {
            uuid: 'z',
            path: '/x/y/z',
            isVisibleInContentTree: true
        }];

        useQuery.mockImplementation(() => ({
            data: {
                jcr: {
                    node: {
                        isVisibleInContentTree: true,
                        ancestors: ancestors
                    }
                }
            }
        }));

        useContentEditorConfigContext.mockImplementation(() => ({
            mode: Constants.routes.baseCreateRoute
        }));

        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        expect(wrapper.find('ContentPath').prop('items')).toEqual([...ancestors, {
            isVisibleInContentTree: true,
            ancestors: ancestors
        }]);
    });

    it('handle something is not right', () => {
        console.log = jest.fn();

        useQuery.mockImplementation(() => ({
            error: {
                message: 'The error is here!',
                code: '25'
            }
        }));

        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        expect(wrapper.text()).toContain('The error is here!');
    });

    it('handle redirects on item click', () => {
        const ancestors = [{
            uuid: 'x',
            path: '/x',
            isVisibleInContentTree: true
        }, {
            uuid: 'y',
            path: '/x/y',
            isVisibleInContentTree: true
        }, {
            uuid: 'z',
            path: '/x/y/z',
            isVisibleInContentTree: true
        }];

        useQuery.mockImplementation(() => ({
            data: {
                jcr: {
                    node: {
                        isVisibleInContentTree: true,
                        ancestors: ancestors
                    }
                }
            }
        }));
        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        wrapper.find('ContentPath').simulate('itemClick', '/x/y/z');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'pages', path: '/x/y/z'});
        expect(envProps.back).not.toHaveBeenCalled();
        expect(wrapper.find('EditPanelDialogConfirmation').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click with dirty form', () => {
        defaultProps.formik.dirty = true;

        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        wrapper.find('ContentPath').simulate('itemClick', '/x/y/z');

        expect(dispatch).not.toHaveBeenCalled();
        expect(envProps.back).not.toHaveBeenCalled();

        expect(wrapper.find('EditPanelDialogConfirmation').props().isOpen).toBeTruthy();

        wrapper.find('EditPanelDialogConfirmation').simulate('closeDialog');
        expect(wrapper.find('EditPanelDialogConfirmation').props().isOpen).toBeFalsy();

        wrapper.find('ContentPath').simulate('itemClick', '/x/y/z');
        expect(wrapper.find('EditPanelDialogConfirmation').props().isOpen).toBeTruthy();
        wrapper.find('EditPanelDialogConfirmation').props().actionCallback();
        expect(envProps.back).toHaveBeenCalledWith('123', 'op');
    });

    it('handle redirects on item click when path start with files', () => {
        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        wrapper.find('ContentPath').simulate('itemClick', '/sites/mySiteXD/files/chocolate');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'media', path: '/sites/mySiteXD/files/chocolate'});
        expect(envProps.back).not.toHaveBeenCalled();
        expect(wrapper.find('EditPanelDialogConfirmation').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click when path start with contents', () => {
        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        wrapper.find('ContentPath').simulate('itemClick', '/sites/mySiteXD/contents/fruits');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'content-folders', path: '/sites/mySiteXD/contents/fruits'});
        expect(envProps.back).not.toHaveBeenCalled();
        expect(wrapper.find('EditPanelDialogConfirmation').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click with option to go back', () => {
        envProps.shouldRedirectBeadCrumb = () => true;

        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        wrapper.find('ContentPath').simulate('itemClick', '/sites/mySiteXD/lord/rings');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'pages', path: '/sites/mySiteXD/lord/rings'});
        expect(envProps.back).toHaveBeenCalled();
        expect(wrapper.find('EditPanelDialogConfirmation').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click when path start with categories', () => {
        const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        wrapper.find('ContentPath').simulate('itemClick', '/sites/systemsite/categories/tennis');

        expect(dispatch).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith('/category-manager');
        expect(envProps.back).not.toHaveBeenCalled();
        expect(wrapper.find('EditPanelDialogConfirmation').props.isOpen).toBeFalsy();
    });
});
