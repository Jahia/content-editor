import React from 'react';
import {shallow} from '@jahia/test-framework';
import {TabBar} from '~/EditPanel/tabbar/tabbar.action';

jest.mock('./TabBar.utils', () => {
    return {
        hasToRenderAction: () => {
            return true;
        }
    };
});

describe('TabBar', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            context: {
                setActiveTab: jest.fn()
            },
            otherProps: true,
            render: () => ''
        };
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
});
