import {getPreviewContext, getPreviewPath, removeSiblings} from './Preview.utils';

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './Preview.utils.test.html'), 'utf8');

describe('Preview.utils', () => {
    it('Should preview the content in case no displayable node', () => {
        let editorContext = {
            path: '/sites/digitall/contents/rich_text',
            lang: 'en',
            nodeData: {
                uuid: 'dummy_uuid',
                path: '/sites/digitall/contents/rich_text',
                displayableNode: null
            },
            currentPage: {
                config: 'module',
                template: 'cm',
                path: '/sites/digitall/contents/rich_text',
                templateType: '.html'
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/contents/rich_text');

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/contents/rich_text');
        expect(previewContext.view).toBe('cm');
        expect(previewContext.contextConfiguration).toBe('module');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('edit');
        expect(previewContext.requestAttributes[0].name).toBe('ce_preview');
        expect(previewContext.requestAttributes[0].value).toBe('dummy_uuid');
    });

    it('Should preview the content in case displayable node is a folder', () => {
        let editorContext = {
            path: '/sites/digitall/contents/rich_text',
            lang: 'en',
            nodeData: {
                uuid: 'dummy_uuid',
                path: '/sites/digitall/contents/rich_text',
                displayableNode: {
                    path: '/sites/digitall/contents',
                    isFolder: true
                }
            },
            currentPage: {
                config: 'module',
                template: 'cm',
                path: '/sites/digitall/contents/rich_text',
                templateType: '.html'
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/contents/rich_text');

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/contents/rich_text');
        expect(previewContext.view).toBe('cm');
        expect(previewContext.contextConfiguration).toBe('module');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('edit');
        expect(previewContext.requestAttributes[0].name).toBe('ce_preview');
        expect(previewContext.requestAttributes[0].value).toBe('dummy_uuid');
    });

    it('Should preview the content as a page in case displayable node is the content itself', () => {
        let editorContext = {
            path: '/sites/digitall/contents/rich_text',
            lang: 'en',
            nodeData: {
                uuid: 'dummy_uuid',
                path: '/sites/digitall/contents/rich_text',
                displayableNode: {
                    path: '/sites/digitall/contents/rich_text',
                    isFolder: false
                }
            },
            currentPage: {
                config: 'page',
                template: 'default',
                path: '/sites/digitall/contents/rich_text',
                templateType: '.html'
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/contents/rich_text');

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/contents/rich_text');
        expect(previewContext.view).toBe('default');
        expect(previewContext.contextConfiguration).toBe('page');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('edit');
        expect(previewContext.requestAttributes[0].name).toBe('ce_preview');
        expect(previewContext.requestAttributes[0].value).toBe('dummy_uuid');
    });

    it('Should preview the displayable node as a page in case displayable node exist and it\'s not a folder', () => {
        let editorContext = {
            path: '/sites/digitall/home/rich_text',
            lang: 'en',
            nodeData: {
                uuid: 'dummy_uuid',
                path: '/sites/digitall/home/rich_text',
                displayableNode: {
                    path: '/sites/digitall/home',
                    isFolder: false
                }
            },
            currentPage: {
                config: 'page',
                template: 'default',
                path: '/sites/digitall/home',
                templateType: '.html'
            }
        };

        const previewContext = getPreviewContext(editorContext);
        expect(getPreviewPath(editorContext.nodeData)).toBe('/sites/digitall/home');

        expect(previewContext.language).toBe('en');
        expect(previewContext.path).toBe('/sites/digitall/home');
        expect(previewContext.view).toBe('default');
        expect(previewContext.contextConfiguration).toBe('page');
        expect(previewContext.templateType).toBe('html');
        expect(previewContext.workspace).toBe('edit');
        expect(previewContext.requestAttributes[0].name).toBe('ce_preview');
        expect(previewContext.requestAttributes[0].value).toBe('dummy_uuid');
        expect(previewContext.requestAttributes[1].name).toBe('ce_preview_wrapper');
        expect(previewContext.requestAttributes[1].value).toBe('/sites/digitall/home/rich_text');
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
