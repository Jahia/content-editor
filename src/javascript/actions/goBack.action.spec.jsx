import {resolveGoBackContext} from './goBack.action';

describe('go back action url resolution', () => {
    const testGoBackContextResolution = (path, parentPath, parentDisplayName, resolvedPath, resolvedMode, shouldUseParentDisplayName) => {
        const resolvedUrl = resolveGoBackContext(path, parentPath, parentDisplayName, 'digitall', 'Digitall');

        expect(resolvedUrl.displayName).toBe(shouldUseParentDisplayName ? parentDisplayName : 'Digitall');
        expect(resolvedUrl.path).toBe(resolvedPath);
        expect(resolvedUrl.mode).toBe(resolvedMode);
    };

    it('Should resolve parent url parent correctly', () => {
        testGoBackContextResolution('/sites/digitall', '/sites', 'sites', '/sites/digitall/', 'pages', false);

        testGoBackContextResolution('/sites/digitall/contents', '/sites/digitall', 'digitall', '/sites/digitall/contents', 'contents', false);
        testGoBackContextResolution('/sites/digitall/home', '/sites/digitall', 'digitall', '/sites/digitall/home', 'pages', false);
        testGoBackContextResolution('/sites/digitall/files', '/sites/digitall', 'digitall', '/sites/digitall/files', 'media', false);

        testGoBackContextResolution('/sites/digitall/contents/contentA', '/sites/digitall/contents', 'contents', '/sites/digitall/contents', 'contents', true);
        testGoBackContextResolution('/sites/digitall/home/richTextA', '/sites/digitall/home', 'home', '/sites/digitall/home', 'pages', true);
        testGoBackContextResolution('/sites/digitall/files/fileA', '/sites/digitall/files', 'files', '/sites/digitall/files', 'media', true);

        testGoBackContextResolution('/sites/digitall/contents/listA/contentA', '/sites/digitall/contents/listA', 'listA', '/sites/digitall/contents/listA', 'contents', true);
        testGoBackContextResolution('/sites/digitall/home/subPageA/richTextA', '/sites/digitall/home/subPageA', 'subPageA', '/sites/digitall/home/subPageA', 'pages', true);
        testGoBackContextResolution('/sites/digitall/files/folderA/fileA', '/sites/digitall/files/folderA', 'folderA', '/sites/digitall/files/folderA', 'media', true);

        testGoBackContextResolution('/sites/digitall/contents/listA/listB/listC/contentA', '/sites/digitall/contents/listA/listB/listC', 'listC', '/sites/digitall/contents/listA/listB/listC', 'contents', true);
        testGoBackContextResolution('/sites/digitall/home/subPageA/subPageB/subPageC/richTextA', '/sites/digitall/home/subPageA/subPageB/subPageC', 'subPageC', '/sites/digitall/home/subPageA/subPageB/subPageC', 'pages', true);
        testGoBackContextResolution('/sites/digitall/files/folderA/folderB/folderC/fileA', '/sites/digitall/files/folderA/folderB/folderC', 'folderC', '/sites/digitall/files/folderA/folderB/folderC', 'media', true);
    });
});
