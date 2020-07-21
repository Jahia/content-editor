import React from 'react';
import {shallow} from '@jahia/test-framework';

import ContentBreadcrumb from './ContentBreadcrumb';
import ContentPath from './ContentPath';
import ContentType from './ContentType';

describe('ContentBreadcrumb', () => {
    it('should render correctly', () => {
        const wrapper = shallow(<ContentBreadcrumb/>);
        expect(wrapper.find(ContentPath)).toHaveLength(1);
        expect(wrapper.find(ContentType)).toHaveLength(1);
    });
});
