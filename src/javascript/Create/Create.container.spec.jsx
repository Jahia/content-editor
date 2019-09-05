import React from 'react';
import {shallow} from 'enzyme';
import {Create} from './Create.container';
import configureStore from 'redux-mock-store';

describe('Create', () => {
    let store;
    beforeEach(() => {
        store = configureStore([])({
            path: '/toto',
            language: 'fr',
            params: {
                contentType: 'contentTypeLOL'
            }
        });
    });

    it('should return formQueryParams with good params', () => {
        const props = shallow(<Create store={store}/>).props();

        expect(props.formQueryParams).toEqual({
            path: '/toto',
            parentPath: '/toto',
            language: 'fr',
            uiLang: 'en',
            primaryNodeType: 'contentTypeLOL'
        });
    });
});
