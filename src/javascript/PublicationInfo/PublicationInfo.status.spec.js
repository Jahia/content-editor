import PublicationInfoStatus from './PublicationInfo.status';
import React from 'react';
import {shallow} from '@jahia/test-framework';
import {Cloud, FileContent, File, NoCloud, Warning} from '@jahia/moonstone/dist/icons';

describe('PublicationInfo.status', () => {
    it('Should display not published chip', () => {
        let wrapper = shallow(<PublicationInfoStatus type="notPublished"/>);

        expect(wrapper.find('Chip').exists()).toBeTruthy();
        expect(wrapper.props().label).toBe('translated_label.contentEditor.publicationStatusBadge.notPublished');
        expect(wrapper.props().color).toBe('warning');
        expect(wrapper.props().icon).toStrictEqual(<NoCloud/>);
    });

    it('Should display modified chip', () => {
        let wrapper = shallow(<PublicationInfoStatus type="modified"/>);

        expect(wrapper.find('Chip').exists()).toBeTruthy();
        expect(wrapper.props().label).toBe('translated_label.contentEditor.publicationStatusBadge.modified');
        expect(wrapper.props().color).toBe('default');
        expect(wrapper.props().icon).toStrictEqual(<File/>);
    });

    it('Should display published chip', () => {
        let wrapper = shallow(<PublicationInfoStatus type="published"/>);

        expect(wrapper.find('Chip').exists()).toBeTruthy();
        expect(wrapper.props().label).toBe('translated_label.contentEditor.publicationStatusBadge.published');
        expect(wrapper.props().color).toBe('accent');
        expect(wrapper.props().icon).toStrictEqual(<Cloud/>);
    });

    it('Should display warning chip', () => {
        let wrapper = shallow(<PublicationInfoStatus type="warning"/>);

        expect(wrapper.find('Chip').exists()).toBeTruthy();
        expect(wrapper.props().label).toBe('translated_label.contentEditor.publicationStatusBadge.warning');
        expect(wrapper.props().color).toBe('warning');
        expect(wrapper.props().icon).toStrictEqual(<Warning/>);
    });

    it('Should display publishing chip', () => {
        let wrapper = shallow(<PublicationInfoStatus type="publishing"/>);

        expect(wrapper.find('Chip').exists()).toBeTruthy();
        expect(wrapper.props().label).toBe('translated_label.contentEditor.publicationStatusBadge.publishing');
        expect(wrapper.props().color).toBe('default');
        expect(wrapper.props().icon).toStrictEqual(<FileContent/>);
    });
});
