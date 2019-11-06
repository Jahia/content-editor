import {PublicationInfoProgress} from './PublicationInfo.progress';
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

describe('PublicationInfo.progress', () => {
    it('Should display progress when publication info is polling', () => {
        let wrapper = shallow(<PublicationInfoProgress classes={{}}/>);
        expect(wrapper.debug()).toContain('LinearProgress');
    });

    it('Should not display progress when publication info is not polling', () => {
        let wrapper = shallow(<PublicationInfoProgress classes={{}}/>);
        expect(wrapper.debug()).not.toContain('LinearProgress');
    });
});
