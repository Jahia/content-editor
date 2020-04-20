import {LockManager} from './LockManager';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('@apollo/react-hooks', () => {
    return {
        useSubscription: jest.fn(),
        useApolloClient: jest.fn(() => ({}))
    };
});

import {useSubscription} from '@apollo/react-hooks';

describe('PublicationInfo.progress', () => {
    it('Should render nothing', () => {
        const cmp = shallow(<LockManager path="/digitall"/>);
        expect(cmp.debug()).toBe('');
    });

    it('Should subscribe to lock endpoint', () => {
        shallow(<LockManager path="/digitall"/>);
        expect(useSubscription).toHaveBeenCalled();
    });
});
