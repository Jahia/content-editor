import EditPanelContent from './EditPanelContent';
import React from 'react';
import {shallow} from '@jahia/test-framework';

describe('EditPanelContent', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            path: '',
            lang: '',
            fields: [],
            siteInfo: {},
            dxContext: {}
        };
    });

    it('should select preview by default', () => {
        const cmp = shallow(<EditPanelContent {...defaultProps}/>).dive().dive();
        expect(cmp.find('WithStyles(ToggleButtonGroup)').props().value).toBe('preview');
    });

    it('should render preview by default', () => {
        const cmp = shallow(<EditPanelContent {...defaultProps}/>).dive().dive();
        const rightColCmp = shallow(cmp.find('WithStyles(TwoColumnsContent)').props().rightCol);

        expect(rightColCmp.name()).toContain('Preview');
    });

    it('should still display preview when clicking on preview button', () => {
        const cmp = shallow(<EditPanelContent {...defaultProps}/>).dive().dive();
        const rightColCmp = shallow(cmp.find('WithStyles(TwoColumnsContent)').props().rightCol);

        cmp.find('WithStyles(ToggleButtonGroup)').props().onChange(null, null);
        expect(rightColCmp.name()).toContain('Preview');
    });

    it('should notRender preview when clicking on off button', () => {
        const cmp = shallow(<EditPanelContent {...defaultProps}/>).dive().dive();

        cmp.find('WithStyles(ToggleButtonGroup)').props().onChange(null, 'off');

        expect(cmp.find('WithStyles(ToggleButtonGroup)').props().value).toBe('off');
        expect(cmp.find('WithStyles(TwoColumnsContent)').exists()).toBe(false);
    });

    it('should render detailsPreview when clicking on details button', () => {
        const cmp = shallow(<EditPanelContent {...defaultProps}/>).dive().dive();

        cmp.find('WithStyles(ToggleButtonGroup)').props().onChange(null, 'details');
        expect(cmp.find('WithStyles(ToggleButtonGroup)').props().value).toBe('details');

        const rightColCmp = cmp.find('WithStyles(TwoColumnsContent)').props().rightCol;
        expect(rightColCmp.type.name).toBe('DetailsPreviewComponent');
    });
});
