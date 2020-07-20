import React from 'react';
import {shallow} from '@jahia/test-framework';
import {BreadcrumbItem, Menu, MenuItem, MoreHoriz} from '@jahia/moonstone';

import CompositePathEntry from './CompositePathEntry';

describe('CompositePathEntry', () => {
    it('should not render anything if items is empty', () => {
        const wrapper = shallow(<CompositePathEntry items={[]}/>);
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it('should render one BreadcrumbItem if items is not empty', () => {
        const wrapper = shallow(<CompositePathEntry items={[{uuid: 'xxx'}, {uuid: 'yyy'}]}/>);
        expect(wrapper.find(BreadcrumbItem)).toHaveLength(1);
    });

    it('should not have a label', () => {
        const wrapper = shallow(<CompositePathEntry items={[{uuid: 'xxx', displayName: 'foo'}]}/>);
        expect(wrapper.find(BreadcrumbItem).prop('label')).toBeUndefined();
    });

    it('should have a MoreHoriz icon', () => {
        const wrapper = shallow(<CompositePathEntry items={[{uuid: 'xxx'}]}/>);
        expect(wrapper.find(BreadcrumbItem).prop('icon')).toEqual(<MoreHoriz/>);
    });

    it('should list all items inside a menu', () => {
        const items = [{uuid: 'ab', displayName: 'AB'}, {uuid: 'xy', displayName: 'XY'}];
        const wrapper = shallow(<CompositePathEntry items={items}/>);
        const menu = wrapper.find(Menu);

        expect(menu).toHaveLength(1);
        expect(menu.children()).toHaveLength(items.length);

        menu.children().forEach((child, index) => {
            expect(child.type()).toBe(MenuItem);
            expect(child.prop('label')).toEqual(items[index].displayName);
        });
    });

    it('should have a hidden menu initially', () => {
        const wrapper = shallow(<CompositePathEntry items={[{uuid: 'xxx'}]}/>);
        expect(wrapper.find(Menu).prop('isDisplayed')).toBeFalsy();
    });

    it('should display the hidden menu on click', () => {
        const wrapper = shallow(<CompositePathEntry items={[{uuid: 'xxx'}]}/>);

        wrapper.find(BreadcrumbItem).invoke('onClick')();

        expect(wrapper.find(Menu).prop('isDisplayed')).toBeTruthy();
    });

    it('should hide the displayed menu on click', () => {
        const wrapper = shallow(<CompositePathEntry items={[{uuid: 'xxx'}]}/>);

        wrapper.find(BreadcrumbItem).invoke('onClick')();
        wrapper.find(BreadcrumbItem).invoke('onClick')();

        expect(wrapper.find(Menu).prop('isDisplayed')).toBeFalsy();
    });

    it('should hide the displayed menu on menu close', () => {
        const wrapper = shallow(<CompositePathEntry items={[{uuid: 'xxx'}]}/>);

        wrapper.find(BreadcrumbItem).invoke('onClick')();
        wrapper.find(Menu).invoke('onClose')();

        expect(wrapper.find(Menu).prop('isDisplayed')).toBeFalsy();
    });

    it('should handle clicks on items', () => {
        const handler = jest.fn();
        const items = [{uuid: 'ab', path: '/a/b'}, {uuid: 'xy', path: '/x/y'}];
        const wrapper = shallow(<CompositePathEntry items={items} onItemClick={handler}/>);

        wrapper.find(MenuItem).forEach(element => element.invoke('onClick')());

        expect(handler).toHaveBeenCalledTimes(items.length);
        expect(handler.mock.calls[0][0]).toBe(items[0].path);
        expect(handler.mock.calls[1][0]).toBe(items[1].path);
    });
});
