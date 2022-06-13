import {PublicationInfoProgress} from './PublicationInfoProgress';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('~/contexts/PublicationInfo', () => {
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

describe('PublicationInfoProgress', () => {
    it('Should display progress when publication info is polling', () => {
        let wrapper = shallow(<PublicationInfoProgress/>);
        expect(wrapper.debug()).toContain('LinearProgress');
    });

    it('Should not display progress when publication info is not polling', () => {
        let wrapper = shallow(<PublicationInfoProgress/>);
        expect(wrapper.debug()).not.toContain('LinearProgress');
    });
});
