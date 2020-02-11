import React from 'react';
import {shallow} from 'enzyme';
import {Create} from './Create.container';
import configureStore from 'redux-mock-store';

describe('Create', () => {
    let store;
    beforeEach(() => {
        store = configureStore([])({
            jcontent: {
                path: '/toto',
                params: {
                    contentType: 'contentTypeLOL'
                }
            },
            language: 'fr'
        });
    });

    it('should return formQueryParams with good params', () => {
        const props = shallow(<Create store={store}/>).props();

        expect(props.formQueryParams).toEqual({
            path: '/toto',
            parentPath: '/toto',
            language: 'fr',
            uilang: 'en',
            primaryNodeType: 'contentTypeLOL'
        });
    });
});
