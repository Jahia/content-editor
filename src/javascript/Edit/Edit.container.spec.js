import React from 'react';
import {shallow} from 'enzyme';
import {Edit} from './Edit.container';
import configureStore from 'redux-mock-store';

jest.mock('react-apollo', () => {
    return {
        withApollo: Cmp => props => <Cmp {...props}/>,
        compose: jest.requireActual('react-apollo').compose
    };
});

describe('Edit', () => {
    let store;
    beforeEach(() => {
        store = configureStore([])({
            path: '/toto',
            language: 'fr'
        });
    });

    it('should return formQueryParams with good params', () => {
        const props = shallow(<Edit store={store}/>).dive().dive().dive().props();

        expect(props.formQueryParams).toEqual({
            path: '/toto',
            language: 'fr',
            uiLang: 'en'
        });
    });
});
