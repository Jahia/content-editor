import {LockManager} from './LockManager';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('@apollo/react-hooks', () => {
    return {
        useApolloClient: jest.fn(() => ({}))
    };
});

describe('PublicationInfo.progress', () => {
    it('Should render nothing', () => {
        const cmp = shallow(<LockManager path="/digitall"/>);
        expect(cmp.debug()).toBe('');
    });
});
