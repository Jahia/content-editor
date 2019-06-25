import {resolveUrl} from './goBackAction';

describe('go back action url resolution', () => {
    const testURLResolution = (path, parentPath, siteKey, resolvedPath, resolvedMode) => {
        const resolvedUrl = resolveUrl(path, parentPath, siteKey);
        expect(resolvedUrl.path).toBe(resolvedPath);
        expect(resolvedUrl.mode).toBe(resolvedMode);
    };

    it('Should resolve parent url parent correctly', () => {
        testURLResolution('/sites/digitall', '/sites', 'digitall', '/sites/digitall/contents', 'browse');

        testURLResolution('/sites/digitall/contents', '/sites/digitall', 'digitall', '/sites/digitall/contents', 'browse');
        testURLResolution('/sites/digitall/home', '/sites/digitall', 'digitall', '/sites/digitall/contents', 'browse');
        testURLResolution('/sites/digitall/files', '/sites/digitall', 'digitall', '/sites/digitall/files', 'browse-files');

        testURLResolution('/sites/digitall/contents/contentA', '/sites/digitall/contents', 'digitall', '/sites/digitall/contents', 'browse');
        testURLResolution('/sites/digitall/home/richTextA', '/sites/digitall/home', 'digitall', '/sites/digitall/home', 'browse');
        testURLResolution('/sites/digitall/files/fileA', '/sites/digitall/files', 'digitall', '/sites/digitall/files', 'browse-files');

        testURLResolution('/sites/digitall/contents/listA/contentA', '/sites/digitall/contents/listA', 'digitall', '/sites/digitall/contents/listA', 'browse');
        testURLResolution('/sites/digitall/home/subPageA/richTextA', '/sites/digitall/home/subPageA', 'digitall', '/sites/digitall/home/subPageA', 'browse');
        testURLResolution('/sites/digitall/files/folderA/fileA', '/sites/digitall/files/folderA', 'digitall', '/sites/digitall/files/folderA', 'browse-files');

        testURLResolution('/sites/digitall/contents/listA/listB/listC/contentA', '/sites/digitall/contents/listA/listB/listC', 'digitall', '/sites/digitall/contents/listA/listB/listC', 'browse');
        testURLResolution('/sites/digitall/home/subPageA/subPageB/subPageC/richTextA', '/sites/digitall/home/subPageA/subPageB/subPageC', 'digitall', '/sites/digitall/home/subPageA/subPageB/subPageC', 'browse');
        testURLResolution('/sites/digitall/files/folderA/folderB/folderC/fileA', '/sites/digitall/files/folderA/folderB/folderC', 'digitall', '/sites/digitall/files/folderA/folderB/folderC', 'browse-files');
    });
});
