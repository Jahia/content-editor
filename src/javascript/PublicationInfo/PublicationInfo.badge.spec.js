import {PublicationInfoBadge} from './PublicationInfo.badge';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('./PublicationInfo.context', () => {
    let called = false;
    return {
        usePublicationInfoContext: () => {
            called = !called;
            return {
                publicationInfoPolling: called
            };
        }
    };
});

describe('PublicationInfo.badge', () => {
    it('Should display badge when publication info is polling', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);
        expect(wrapper.debug()).toContain('Chip');
    });

    it('Should not display badge when publication info is not polling', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);
        expect(wrapper.debug()).not.toContain('Chip');
    });
});
