import React from 'react';
import {shallow} from '@jahia/test-framework';
import {Chip} from '@jahia/moonstone';

import ContentType from './ContentType';
import {getNodeTypeIcon} from '../ContentBreadcrumb.utils';

describe('ContentType', () => {
    it('should render one Chip', () => {
        const wrapper = shallow(<ContentType name="foo" displayName="bar"/>);
        expect(wrapper.containsMatchingElement(
            <Chip color="accent" label="bar" icon={getNodeTypeIcon('bar')}/>
        )).toBeTruthy();
    });

    it('should use \'name\' for label when no \'displayName\' was provided', () => {
        const wrapper = shallow(<ContentType name="foo"/>);
        expect(wrapper.find(Chip).prop('label')).toEqual('foo');
    });
});
