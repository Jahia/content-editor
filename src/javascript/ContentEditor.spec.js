import React from 'react';
import {shallow} from 'enzyme';
import ContentEditor from './ContentEditor';

describe('ContentEditor', () => {
    it('should not throw error', () => {
        shallow(<ContentEditor/>);
    });
});
