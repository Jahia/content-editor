import React from 'react';
import {shallow} from '@jahia/test-framework';
import ContentHeader from './ContentHeader';

describe('Content header', () => {
    it('Should render', () => {
        const contentHeader = shallow(<ContentHeader>toto</ContentHeader>);
        expect(contentHeader.html()).toEqual('<header class="header">toto</header>');
    });
});
