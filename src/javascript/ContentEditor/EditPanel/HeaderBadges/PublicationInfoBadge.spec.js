import {PublicationInfoBadge} from './PublicationInfoBadge';
import React from 'react';
import {shallow} from '@jahia/test-framework';
import {PublicationStatus} from './PublicationStatus';

jest.mock('react-redux', () => {
    return {
        ...jest.requireActual('react-redux'),
        useSelector: cb => cb({uilang: 'en'})
    };
});

jest.mock('~/contexts/PublicationInfo', () => {
    let callCount = 0;
    const contexts = [
        {
            publicationInfoPolling: true
        },
        {
            publicationInfoPolling: false
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'MODIFIED'
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'NOT_PUBLISHED'
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'PUBLISHED'
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'UNPUBLISHED'
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'CONFLICT'
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'MANDATORY_LANGUAGE_VALID'
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'MANDATORY_LANGUAGE_UNPUBLISHABLE'
        },
        {
            publicationInfoPolling: false,
            publicationStatus: 'UNKNOWN_STATUS'
        }
    ];
    return {
        usePublicationInfoContext: () => {
            const context = contexts[callCount];
            callCount++;

            return context;
        }
    };
});

describe('PublicationInfoBadge', () => {
    it('Should display "publishing" badge when publication info is polling', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="publishing"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should not display "publishing" badge when publication info is not polling', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="notPublished"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should display "modified" and "live" badges when MODIFIED publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="modified" tooltip="translated_label.contentEditor.publicationStatusTooltip.modified"/>)).toBeTruthy();
        expect(wrapper.containsMatchingElement(<PublicationStatus type="published" tooltip="translated_label.contentEditor.publicationStatusTooltip.published"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(2);
    });

    it('Should display "not published" badge when NOT_PUBLISHED publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="notPublished"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should display "live" badge when PUBLISHED publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="published" tooltip="translated_label.contentEditor.publicationStatusTooltip.published"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should display "not published" badge when UNPUBLISHED publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="notPublished"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should display "warning" badge when CONFLICT publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="warning" tooltip="translated_label.contentEditor.publicationStatusTooltip.conflict"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should display "warning" badge when MANDATORY_LANGUAGE_VALID publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="warning" tooltip="translated_label.contentEditor.publicationStatusTooltip.mandatoryLanguageValid"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should display "warning" badge when MANDATORY_LANGUAGE_UNPUBLISHABLE publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="warning" tooltip="translated_label.contentEditor.publicationStatusTooltip.mandatoryLanguageUnpublishable"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });

    it('Should display "warning" badge when unknown publication info', () => {
        let wrapper = shallow(<PublicationInfoBadge classes={{}}/>);

        expect(wrapper.containsMatchingElement(<PublicationStatus type="warning" tooltip="translated_label.contentEditor.publicationStatusTooltip.unknown"/>)).toBeTruthy();
        expect(wrapper.find('PublicationStatus')).toHaveLength(1);
    });
});
