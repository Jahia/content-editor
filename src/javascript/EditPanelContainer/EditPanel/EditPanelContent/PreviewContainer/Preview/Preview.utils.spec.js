import {getPreviewContext, getPreviewPath} from './Preview.utils';

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
        expect(previewContext.requestAttributes).toBe(null);
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
        expect(previewContext.requestAttributes).toBe(null);
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
        expect(previewContext.view).toBe('default');
        expect(previewContext.contextConfiguration).toBe('page');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('EDIT');
        expect(previewContext.requestAttributes).toBe(null);
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
        expect(previewContext.view).toBe('default');
        expect(previewContext.contextConfiguration).toBe('page');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('EDIT');
        expect(previewContext.requestAttributes[0].name).toBe('ce_preview_wrapper');
        expect(previewContext.requestAttributes[0].value).toBe('/sites/digitall/home/rich_text');
    });

    it('Should return the path of the previewed node', () => {
        let nodeData = {
            path: '/sites/digitall/home/banner',
            displayableNode: {
                path: '/sites/digitall/home',
                isFolder: false
            }
        };

        expect(getPreviewPath(nodeData)).toBe('/sites/digitall/home');

        nodeData = {
            path: '/sites/digitall/contents/banner',
            displayableNode: {
                path: '/sites/digitall/contents',
                isFolder: true
            }
        };

        expect(getPreviewPath(nodeData)).toBe('/sites/digitall/contents/banner');

        nodeData = {
            path: '/sites/digitall/home/news1',
            displayableNode: {
                path: '/sites/digitall/home/news1',
                isFolder: false
            }
        };

        expect(getPreviewPath(nodeData)).toBe('/sites/digitall/home/news1');

        nodeData = {
            path: '/sites/digitall/home/news1',
            displayableNode: null
        };

        expect(getPreviewPath(nodeData)).toBe('/sites/digitall/home/news1');
    });
});
