import React from 'react';
import {useSelector} from 'react-redux';
import {shallow} from '@jahia/test-framework';
import {useNodeInfo} from '@jahia/data-helper';

import ContentType from './ContentType';
import ContentTypeContainer from './ContentType.container';

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

jest.mock('@jahia/data-helper', () => ({
    useNodeInfo: jest.fn().mockReturnValue({})
}));

describe('ContentTypeContainer', () => {
    afterEach(() => {
        useNodeInfo.mockClear();
        useSelector.mockClear();
    });

    it('uses expected query parameters', () => {
        useSelector.mockImplementation(callback => callback({
            uilang: 'fr',
            jcontent: {
                mode: ''
            }
        }));

        shallow(<ContentTypeContainer path="/x/y/z"/>);

        const expectedVariables = {path: '/x/y/z', displayLanguage: 'fr'};
        const expectedOptions = {getPrimaryNodeType: true};
        expect(useNodeInfo).toHaveBeenCalledWith(expectedVariables, expectedOptions);
    });

    it('renders correctly', () => {
        useNodeInfo.mockImplementation(() => ({
            node: {
                primaryNodeType: {
                    name: 'foo',
                    displayName: 'Foo'
                }
            }
        }));

        const wrapper = shallow(<ContentTypeContainer/>);
        expect(wrapper.matchesElement(<ContentType name="foo" displayName="Foo"/>)).toBeTruthy();
    });

    it('should not render anything if node has no primary type', () => {
        useNodeInfo.mockImplementation(() => ({
            node: {}
        }));

        const wrapper = shallow(<ContentTypeContainer/>);
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });
});
