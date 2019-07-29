import {EditPanelContent} from './EditPanelContent';
import React from 'react';
import {shallow} from '@jahia/test-framework';

describe('EditPanelContent', () => {
    let defaultProps;
    let wrapper;

    beforeEach(() => {
        defaultProps = {
            t: i18nKey => i18nKey,
            fields: [],
            siteInfo: {},
            classes: {}
        };
        wrapper = shallow(<EditPanelContent {...defaultProps}/>);
    });

    it('should select preview by default', () => {
        expect(wrapper).toBeDefined();
    });
});
