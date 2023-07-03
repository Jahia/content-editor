import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {shallow} from '@jahia/test-framework';

import {push} from 'connected-react-router';
import {cmGoto} from '~/redux/JContent.redux-actions';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';

import {GetContentPath} from './ContentPath.gql-queries';
import {ContentPath} from './ContentPath';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';

jest.mock('connected-react-router', () => ({
    push: jest.fn()
}));

jest.mock('~/redux/JContent.redux-actions', () => ({
    cmGoto: jest.fn()
}));

jest.mock('~/contexts/ContentEditor/ContentEditor.context');
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context');

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn().mockReturnValue({})
}));

jest.mock('formik');

Object.defineProperty(window, 'location', {
    value: {
        url: {
            contains: () => false
        }
    },
    writable: true
});

describe('ContentPathContainer', () => {
    let defaultProps;

    let dispatch = jest.fn();
    let contentEditorContext;
    let contentEditorConfigContext;

    beforeEach(() => {
        useFormikContext.mockReturnValue({dirty: false});

        defaultProps = {
            uuid: '123',
            operator: 'op'
        };

        useSelector.mockImplementation(callback => callback({
            language: 'fr'
        }));

        const updateEditorConfig = jest.fn();
        updateEditorConfig.mockImplementation(({closed, onExited}) => {
            if (closed) {
                onExited();
            }
        });
        contentEditorConfigContext = {
            updateEditorConfig: updateEditorConfig
        };
        useContentEditorConfigContext.mockImplementation(() => contentEditorConfigContext);
        contentEditorContext = {
            i18nContext: {},
            site: 'mySiteXD'
        };
        useContentEditorContext.mockImplementation(() => contentEditorContext);

        useDispatch.mockImplementation(() => dispatch);
    });

    afterEach(() => {
        dispatch = jest.fn();
        useQuery.mockClear();
        useDispatch.mockClear();
        useSelector.mockClear();
    });

    it('uses expected query parameters', () => {
        shallow(<ContentPath path="/x/y/z" {...defaultProps}/>);

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

        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        expect(wrapper.find('ContentPathView').prop('items')).toEqual(ancestors);
        expect(wrapper.find('ContentPathView').prop('onItemClick')).toBeDefined();
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

        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        expect(wrapper.find('ContentPathView').prop('items')).toEqual(ancestors.slice(1));
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
            ...contentEditorConfigContext,
            mode: Constants.routes.baseCreateRoute
        }));

        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        expect(wrapper.find('ContentPathView').prop('items')).toEqual([...ancestors, {
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

        const wrapper = shallow(<ContentPath {...defaultProps}/>);
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
        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        wrapper.find('ContentPathView').simulate('itemClick', '/x/y/z');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'pages', path: '/x/y/z'});
        expect(contentEditorConfigContext.updateEditorConfig).toHaveBeenCalled();
        expect(wrapper.find('CloseConfirmationDialog').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click with dirty form', () => {
        contentEditorContext.i18nContext.en = {
            validation: {},
            values: {}
        };

        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        wrapper.find('ContentPathView').simulate('itemClick', '/x/y/z');

        expect(dispatch).not.toHaveBeenCalled();
        expect(contentEditorConfigContext.updateEditorConfig).not.toHaveBeenCalled();

        expect(wrapper.find('CloseConfirmationDialog').props().isOpen).toBeTruthy();

        wrapper.find('CloseConfirmationDialog').simulate('closeDialog');
        expect(wrapper.find('CloseConfirmationDialog').props().isOpen).toBeFalsy();

        wrapper.find('ContentPathView').simulate('itemClick', '/x/y/z');
        expect(wrapper.find('CloseConfirmationDialog').props().isOpen).toBeTruthy();
        wrapper.find('CloseConfirmationDialog').props().actionCallback();
        expect(contentEditorConfigContext.updateEditorConfig).toHaveBeenCalled();
    });

    it('handle redirects on item click when path start with files', () => {
        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        wrapper.find('ContentPathView').simulate('itemClick', '/sites/mySiteXD/files/chocolate');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'media', path: '/sites/mySiteXD/files/chocolate'});
        expect(contentEditorConfigContext.updateEditorConfig).toHaveBeenCalled();
        expect(wrapper.find('CloseConfirmationDialog').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click when path start with contents', () => {
        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        wrapper.find('ContentPathView').simulate('itemClick', '/sites/mySiteXD/contents/fruits');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'content-folders', path: '/sites/mySiteXD/contents/fruits'});
        expect(contentEditorConfigContext.updateEditorConfig).toHaveBeenCalled();
        expect(wrapper.find('CloseConfirmationDialog').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click with option to go back', () => {
        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        wrapper.find('ContentPathView').simulate('itemClick', '/sites/mySiteXD/lord/rings');

        expect(dispatch).toHaveBeenCalled();
        expect(cmGoto).toHaveBeenCalledWith({mode: 'pages', path: '/sites/mySiteXD/lord/rings'});
        expect(contentEditorConfigContext.updateEditorConfig).toHaveBeenCalled();
        expect(wrapper.find('CloseConfirmationDialog').props.isOpen).toBeFalsy();
    });

    it('handle redirects on item click when path start with categories', () => {
        const wrapper = shallow(<ContentPath {...defaultProps}/>);
        wrapper.find('ContentPathView').simulate('itemClick', '/sites/systemsite/categories/tennis');

        expect(dispatch).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith('/category-manager');
        expect(contentEditorConfigContext.updateEditorConfig).toHaveBeenCalled();
        expect(wrapper.find('CloseConfirmationDialog').props.isOpen).toBeFalsy();
    });
});
