import {EditPanelContent} from './EditPanelContent';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => ({
            hasPreview: true,
            nodeData: {
                uuid: 'edit-editpanelcontent'
            }
        })
    };
});
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context', () => {
    return {
        useContentEditorConfigContext: () => ({
            mode: 'edit'
        })
    };
});

describe('EditPanelContent', () => {
    let defaultProps;
    let wrapper;

    beforeEach(() => {
        defaultProps = {
            fields: [],
            siteInfo: {},
            classes: {}
        };
        wrapper = shallow(<EditPanelContent {...defaultProps}/>);
    });

    it('should not throw an error', () => {
        expect(wrapper).toBeDefined();
    });
});
