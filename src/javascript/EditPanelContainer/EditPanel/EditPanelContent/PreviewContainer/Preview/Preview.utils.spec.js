import {getPreviewContext} from './Preview.utils';

describe('Preview.utils', () => {
    it('Should preview the content in case no displayable node', () => {
        let editorContext = {
            path: '/sites/digitall/contents/rich_text',
            lang: 'en',
            nodeData: {
                displayableNode: null
            }
        };

        const previewContext = getPreviewContext(editorContext);

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/contents/rich_text');
        expect(previewContext.view).toBe('cm');
        expect(previewContext.contextConfiguration).toBe('module');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('EDIT');
    });

    it('Should preview the content in case displayable node is a folder', () => {
        let editorContext = {
            path: '/sites/digitall/contents/rich_text',
            lang: 'en',
            nodeData: {
                displayableNode: {
                    path: '/sites/digitall/contents',
                    isFolder: true
                }
            }
        };

        const previewContext = getPreviewContext(editorContext);

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/contents/rich_text');
        expect(previewContext.view).toBe('cm');
        expect(previewContext.contextConfiguration).toBe('module');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('EDIT');
    });

    it('Should preview the content as a page in case displayable node is the content itself', () => {
        let editorContext = {
            path: '/sites/digitall/contents/rich_text',
            lang: 'en',
            nodeData: {
                displayableNode: {
                    path: '/sites/digitall/contents/rich_text',
                    isFolder: false
                }
            }
        };

        const previewContext = getPreviewContext(editorContext);

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/contents/rich_text');
        expect(previewContext.view).toBe(null);
        expect(previewContext.contextConfiguration).toBe('page');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('EDIT');
    });

    it('Should preview the displayable node as a page in case displayable node exist and it\'s not a folder', () => {
        let editorContext = {
            path: '/sites/digitall/home/rich_text',
            lang: 'en',
            nodeData: {
                displayableNode: {
                    path: '/sites/digitall/home',
                    isFolder: false
                }
            }
        };

        const previewContext = getPreviewContext(editorContext);

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/home');
        expect(previewContext.view).toBe(null);
        expect(previewContext.contextConfiguration).toBe('page');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('EDIT');
    });
});
