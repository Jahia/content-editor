import React from 'react';
import {shallow} from 'enzyme';
import ContentEditor from './ContentEditor';

jest.mock('react-apollo', () => {
    return {
        withApollo: Cmp => props => (<Cmp {...props} client={{}}/>),
        compose: jest.requireActual('react-apollo').compose
    };
});

describe('ContentEditor', () => {
    it('should display Create route when mode is create', () => {
        const cmp = shallow(<ContentEditor mode="create"/>).dive();

        expect(cmp.find('CreateContainer').exists()).toBe(true);
    });

    it('should display Edit route when mode is edit', () => {
        const cmp = shallow(<ContentEditor mode="edit"/>).dive();

        expect(cmp.find('EditContainer').exists()).toBe(true);
    });
});
