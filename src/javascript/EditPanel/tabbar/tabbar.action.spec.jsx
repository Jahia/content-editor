import React from 'react';
import {shallow} from '@jahia/test-framework';
import {TabBar} from '~/EditPanel/tabbar/tabbar.action';

jest.mock('@jahia/data-helper', () => {
    return {useNodeChecks: jest.fn()};
});
import {useNodeChecks} from '@jahia/data-helper';

describe('TabBar', () => {
    let defaultProps;
    let loading = false;
    let checksResult = true;

    beforeEach(() => {
        defaultProps = {
            context: {
                setActiveTab: jest.fn(),
                isDisplayable: () => true
            },
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

        cmp.props().context.onClick();

        expect(defaultProps.context.setActiveTab).toHaveBeenCalled();
    });

    it('should not render Tabbar when loading', () => {
        loading = true;
        defaultProps.loading = () => (<>Loading...</>);

        const cmp = shallow(<TabBar {...defaultProps}/>);

        expect(cmp.dive().debug()).toContain('Loading...');
    });

    it('should not render Tabbar when checksResult is false', () => {
        checksResult = false;

        const cmp = shallow(<TabBar {...defaultProps}/>);

        expect(cmp.find('render').exists()).toBeFalsy();
    });
});
