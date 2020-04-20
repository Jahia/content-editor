import React from 'react';
import {IframeViewer} from './';
import {shallow} from '@jahia/test-framework';

describe('IframeViewer', () => {
    let props;
    beforeEach(() => {
        props = {
            previewContext: {
                workspace: 'hello'
            },
            onContentNotFound: jest.fn(),
            data: {}
        };
    });

    it('should display a loader while content is not fully initialized', () => {
        const cmp = shallow(<IframeViewer {...props}/>);
        expect(cmp.find('WithStyles(ProgressOverlayCmp)').exists()).toBe(true);
    });
});
