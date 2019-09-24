import {getPreviewContext, removeSiblings, getPreviewPath} from './Preview.utils';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './Preview.utils.test.html'), 'utf8');

describe('Preview.utils', () => {
    it('Should preview the content in case no displayable node', () => {
        let editorContext = {
            path: '/sites/digitall/contents/rich_text',
            lang: 'en',
            nodeData: {
                path: '/sites/digitall/contents/rich_text',
                displayableNode: null
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/contents/rich_text');

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
                path: '/sites/digitall/contents/rich_text',
                displayableNode: {
                    path: '/sites/digitall/contents',
                    isFolder: true
                }
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/contents/rich_text');

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
                path: '/sites/digitall/contents/rich_text',
                displayableNode: {
                    path: '/sites/digitall/contents/rich_text',
                    isFolder: false
                }
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/contents/rich_text');

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
                path: '/sites/digitall/home/rich_text',
                displayableNode: {
                    path: '/sites/digitall/home',
                    isFolder: false
                }
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/home/rich_text');

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/home');
        expect(previewContext.view).toBe('default');
        expect(previewContext.contextConfiguration).toBe('page');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('EDIT');
        expect(previewContext.requestAttributes[0].name).toBe('ce_preview_wrapper');
        expect(previewContext.requestAttributes[0].value).toBe('/sites/digitall/home/rich_text');
    });

    it('Should zoom on the content by cleaning the html', () => {
        document.documentElement.innerHTML = html.toString();
        expect(document.getElementsByClassName('should_be_removed').length).toBe(9);
        expect(document.getElementsByClassName('should_be_keeped').length).toBe(10);
        removeSiblings(document.getElementById('ce_preview_content'));
        expect(document.getElementsByClassName('should_be_removed').length).toBe(0);
        expect(document.getElementsByClassName('should_be_keeped').length).toBe(10);
    });
});
