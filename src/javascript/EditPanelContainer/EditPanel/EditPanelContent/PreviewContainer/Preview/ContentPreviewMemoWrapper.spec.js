import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ContentPreviewMemoWrapper} from './ContentPreviewMemoWrapper';

describe('Preview', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            path: '/sites/digitall',
            lang: 'fr',
            workspace: 'EDIT'
        };
    });

    it('should display the preview with the provided path', () => {
        const cmp = shallowWithTheme(<ContentPreviewMemoWrapper {...defaultProps}/>,
            {},
            dsGenericTheme);
        const props = cmp.dive().find('ContentPreview').props();
        expect(props.language).toBe(defaultProps.lang);
        expect(props.path).toBe(defaultProps.path);
        expect(props.workspace).toBe(defaultProps.workspace);
    });
});
