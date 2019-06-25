import {resolveGoBackContext} from './goBackAction';

describe('go back action url resolution', () => {
    const testGoBackContextResolution = (path, parentPath, parentDisplayName, resolvedPath, resolvedMode, shouldUseParentDisplayName) => {
        const resolvedUrl = resolveGoBackContext(path, parentPath, parentDisplayName, 'digitall', 'Digitall');

        expect(resolvedUrl.displayName).toBe(shouldUseParentDisplayName ? parentDisplayName : 'Digitall');
        expect(resolvedUrl.path).toBe(resolvedPath);
        expect(resolvedUrl.mode).toBe(resolvedMode);
    };

    it('Should resolve parent url parent correctly', () => {
        testGoBackContextResolution('/sites/digitall', '/sites', 'sites', '/sites/digitall/contents', 'browse', false);

        testGoBackContextResolution('/sites/digitall/contents', '/sites/digitall', 'digitall', '/sites/digitall/contents', 'browse', false);
        testGoBackContextResolution('/sites/digitall/home', '/sites/digitall', 'digitall', '/sites/digitall/contents', 'browse', false);
        testGoBackContextResolution('/sites/digitall/files', '/sites/digitall', 'digitall', '/sites/digitall/files', 'browse-files', false);

        testGoBackContextResolution('/sites/digitall/contents/contentA', '/sites/digitall/contents', 'contents', '/sites/digitall/contents', 'browse', true);
        testGoBackContextResolution('/sites/digitall/home/richTextA', '/sites/digitall/home', 'home', '/sites/digitall/home', 'browse', true);
        testGoBackContextResolution('/sites/digitall/files/fileA', '/sites/digitall/files', 'files', '/sites/digitall/files', 'browse-files', true);

        testGoBackContextResolution('/sites/digitall/contents/listA/contentA', '/sites/digitall/contents/listA', 'listA', '/sites/digitall/contents/listA', 'browse', true);
        testGoBackContextResolution('/sites/digitall/home/subPageA/richTextA', '/sites/digitall/home/subPageA', 'subPageA', '/sites/digitall/home/subPageA', 'browse', true);
        testGoBackContextResolution('/sites/digitall/files/folderA/fileA', '/sites/digitall/files/folderA', 'folderA', '/sites/digitall/files/folderA', 'browse-files', true);

        testGoBackContextResolution('/sites/digitall/contents/listA/listB/listC/contentA', '/sites/digitall/contents/listA/listB/listC', 'listC', '/sites/digitall/contents/listA/listB/listC', 'browse', true);
        testGoBackContextResolution('/sites/digitall/home/subPageA/subPageB/subPageC/richTextA', '/sites/digitall/home/subPageA/subPageB/subPageC', 'subPageC', '/sites/digitall/home/subPageA/subPageB/subPageC', 'browse', true);
        testGoBackContextResolution('/sites/digitall/files/folderA/folderB/folderC/fileA', '/sites/digitall/files/folderA/folderB/folderC', 'folderC', '/sites/digitall/files/folderA/folderB/folderC', 'browse-files', true);
    });
});
