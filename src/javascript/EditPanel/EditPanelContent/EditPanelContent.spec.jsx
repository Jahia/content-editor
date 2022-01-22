import {EditPanelContent} from './EditPanelContent';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorConfigContext: () => ({
            mode: 'edit'
        }),
        useContentEditorContext: () => ({
            hasPreview: true
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
            classes: {},
            formik: {}
        };
        wrapper = shallow(<EditPanelContent {...defaultProps}/>);
    });

    it('should not throw an error', () => {
        expect(wrapper).toBeDefined();
    });
});
