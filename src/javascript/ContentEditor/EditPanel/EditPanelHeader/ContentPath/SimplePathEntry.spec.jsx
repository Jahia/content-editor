import React from 'react';
import {shallow} from '@jahia/test-framework';
import {BreadcrumbItem} from '@jahia/moonstone';

import {SimplePathEntry} from './SimplePathEntry';
import {getNodeTypeIcon} from '~/utils';

describe('SimplePathEntry', () => {
    it('should render one BreadcrumbItem', () => {
        const wrapper = shallow(<SimplePathEntry item={{
            displayName: 'foo',
            primaryNodeType: {
                name: 'bar'
            }
        }}/>);

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop('icon')).toEqual(getNodeTypeIcon('bar'));
        expect(wrapper.prop('label')).toEqual('foo');
    });

    it('should handle clicks', () => {
        const handler = jest.fn();
        const wrapper = shallow(<SimplePathEntry item={{path: '/a/b/c'}} onItemClick={handler}/>);

        wrapper.find(BreadcrumbItem).invoke('onClick')();

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith('/a/b/c');
    });
});
