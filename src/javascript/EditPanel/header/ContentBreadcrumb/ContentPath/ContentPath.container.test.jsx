import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {shallow} from '@jahia/test-framework';

import {GetContentPath} from './ContentPath.gql-queries';
import ContentPathContainer from './ContentPath.container';

jest.mock('connected-react-router', () => ({
    push: jest.fn()
}));

jest.mock('~/JContent.redux-actions', () => ({
    cmGoto: jest.fn()
}));

jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorConfigContext: () => ({
            envProps: {
                back: jest.fn()
            }
        })
    };
});

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn().mockReturnValue({})
}));

describe('ContentPathContainer', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            context: {
                formik: {
                    dirty: false
                }
            }
        };

        useSelector.mockImplementation(callback => callback({
            language: 'fr',
            jcontent: {
                mode: ''
            }
        }));
    });

    afterEach(() => {
        useQuery.mockClear();
        useDispatch.mockClear();
        useSelector.mockClear();
    });

    it('uses expected query parameters', () => {
        useSelector.mockImplementation(callback => callback({
            language: 'fr',
            jcontent: {
                mode: ''
            }
        }));

        shallow(<ContentPathContainer path="/x/y/z"/>);

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

    it('handle redirects on item click', () => {
        // TODO: add/update unit tests BACKLOG-14189
        // const dispatch = jest.fn();
        //
        // useDispatch.mockImplementation(() => dispatch);
        //
        // useSelector.mockImplementation(callback => callback({
        //     jcontent: {
        //         mode: 'foo'
        //     }
        // }));
        //
        // const wrapper = shallow(<ContentPathContainer {...defaultProps}/>);
        // wrapper.find('ContentPath').simulate('onItemClick', '/x/y/z');
        //
        // expect(dispatch).toHaveBeenCalledTimes(1);
        // expect(cmGoto).toHaveBeenCalledWith({mode: 'foo', path: '/x/y/z'});
    });
});
