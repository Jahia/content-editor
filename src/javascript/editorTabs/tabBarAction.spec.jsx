import React from 'react';
import {shallow} from '@jahia/test-framework';
import {TabBar} from './tabBarAction';
import {useNodeChecks} from '@jahia/data-helper';

jest.mock('@jahia/data-helper', () => {
    const original = jest.requireActual('@jahia/data-helper');
    return {
        ...original,
        useNodeChecks: jest.fn()
    };
});

describe('TabBar', () => {
    let defaultProps;
    let loading = false;
    let checksResult = true;

    beforeEach(() => {
        defaultProps = {
            setActiveTab: jest.fn(),
            activeTab: 'EDIT',
            value: 'advancedOptions',
            isDisplayable: () => true,
            otherProps: true,
            render: () => ''
        };
        useNodeChecks.mockImplementation(() => {
            return {checksResult: checksResult, loading: loading};
        });
    });

    it('should pass otherProps to the render component', () => {
        const cmp = shallow(<TabBar {...defaultProps}/>);

        expect(cmp.find('render').props().otherProps).toBe(true);
    });

    it('should call setActiveBar function when onClick is called', () => {
        const cmp = shallow(<TabBar {...defaultProps}/>).find('render');

        cmp.props().onClick();

        expect(defaultProps.setActiveTab).toHaveBeenCalled();
    });

    it('should not render Tabbar when checksResult is false', () => {
        checksResult = false;

        const cmp = shallow(<TabBar {...defaultProps}/>);

        expect(cmp.find('render').exists()).toBeFalsy();
    });
});
