import React from 'react';
import {shallow} from '@jahia/test-framework';
import {Breadcrumb} from '@jahia/moonstone';

import ContentPath from './ContentPath';
import SimplePathEntry from './SimplePathEntry';
import CompositePathEntry from './CompositePathEntry';

describe('ContentPath', () => {
    it('should not render anything when items is empty', () => {
        const wrapper = shallow(<ContentPath items={[]}/>);
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it('should render a Breadcrumb when items is not empty', () => {
        const wrapper = shallow(<ContentPath items={[{uuid: 'x'}]}/>);
        expect(wrapper.find(Breadcrumb)).toHaveLength(1);
    });

    it('should render one entry per item when items has less than 4 elements', () => {
        const items = [
            {uuid: 'a', displayName: 'A'},
            {uuid: 'b', displayName: 'B'},
            {uuid: 'c', displayName: 'C'}
        ];
        const wrapper = shallow(<ContentPath items={items}/>);
        const breadcrumb = wrapper.find(Breadcrumb);

        const entries = breadcrumb.find(SimplePathEntry);
        expect(entries).toHaveLength(items.length);

        entries.forEach((entry, index) =>
            expect(entry.prop('item')).toEqual(items[index])
        );
    });

    it('should render three entries when items has more than 3 elements', () => {
        const items = [
            {uuid: 'a', displayName: 'A'},
            {uuid: 'b', displayName: 'B'},
            {uuid: 'c', displayName: 'C'},
            {uuid: 'd', displayName: 'D'}
        ];
        const wrapper = shallow(<ContentPath items={items}/>);
        const breadcrumb = wrapper.find(Breadcrumb);

        expect(breadcrumb.find(SimplePathEntry)).toHaveLength(2);
        expect(breadcrumb.find(CompositePathEntry)).toHaveLength(1);

        const firstEntry = breadcrumb.childAt(0);
        expect(firstEntry.type()).toEqual(SimplePathEntry);
        expect(firstEntry.prop('item')).toEqual(items[0]);

        const middleEntry = breadcrumb.childAt(1);
        expect(middleEntry.type()).toEqual(CompositePathEntry);
        expect(middleEntry.prop('items')).toEqual(items.slice(1, items.length - 1));

        const lastEntry = breadcrumb.childAt(2);
        expect(lastEntry.type()).toEqual(SimplePathEntry);
        expect(lastEntry.prop('item')).toEqual(items[items.length - 1]);
    });
});
