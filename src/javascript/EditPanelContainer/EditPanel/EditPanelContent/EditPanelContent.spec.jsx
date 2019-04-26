import {EditPanelContent} from './EditPanelContent';
import React from 'react';
import {shallow} from '@jahia/test-framework';

describe('EditPanelContent', () => {
    let defaultProps;
    let wrapper;

    beforeEach(() => {
        defaultProps = {
            t: i18nKey => i18nKey,
            context: {
                path: '',
                lang: 'en'
            },
            fields: [],
            siteInfo: {},
            classes: {}
        };
        wrapper = shallow(<EditPanelContent {...defaultProps}/>);
    });

    it('should select preview by default', () => {
        expect(wrapper.find('WithStyles(ToggleButtonGroup)').props().value).toBe('preview');
    });

    it('should render preview by default', () => {
        const rightColCmp = shallow(wrapper.find('WithStyles(TwoColumnsContent)').props().rightCol);

        expect(rightColCmp.name()).toContain('Preview');
    });

    it('should still display preview when clicking on preview button', () => {
        const rightColCmp = shallow(wrapper.find('WithStyles(TwoColumnsContent)').props().rightCol);

        wrapper.find('WithStyles(ToggleButtonGroup)').props().onChange(null, null);
        expect(rightColCmp.name()).toContain('Preview');
    });

    it('should notRender preview when clicking on off button', () => {
        wrapper.find('WithStyles(ToggleButtonGroup)').props().onChange(null, 'off');

        expect(wrapper.find('WithStyles(ToggleButtonGroup)').props().value).toBe('off');
        expect(wrapper.find('WithStyles(TwoColumnsContent)').exists()).toBe(false);
    });

    it('should render detailsPreview when clicking on details button', () => {
        wrapper.find('WithStyles(ToggleButtonGroup)').props().onChange(null, 'details');
        expect(wrapper.find('WithStyles(ToggleButtonGroup)').props().value).toBe('details');

        const rightColCmp = wrapper.find('WithStyles(TwoColumnsContent)').props().rightCol;
        expect(rightColCmp.type.name).toBe('DetailsPreviewComponent');
    });
});
