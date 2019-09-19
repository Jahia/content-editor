import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ContentPreviewMemoWrapper} from './ContentPreviewMemoWrapper';

jest.mock('../../../../../ContentEditor.context', () => ({
    useContentEditorContext: () => ({
        path: '/site/digitall',
        lang: 'fr',
        nodeData: {
            displayableNode: null
        }
    })
}));

describe('Preview', () => {
    it('should display the preview with the provided path', () => {
        const cmp = shallowWithTheme(<ContentPreviewMemoWrapper/>,
            {},
            dsGenericTheme);
        const props = cmp.find('ContentPreview').props();
        expect(props.language).toBe('fr');
        expect(props.path).toBe('/site/digitall');
        expect(props.workspace).toBe('EDIT');
    });
});
