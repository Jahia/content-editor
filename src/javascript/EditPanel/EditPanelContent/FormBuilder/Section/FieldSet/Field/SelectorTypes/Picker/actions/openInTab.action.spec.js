import {openInTabAction} from './openInTab.action';
import {Constants} from '~/ContentEditor.constants';

describe('openInTab action', () => {
    it('should open in new tab on click', () => {
        window.open = jest.fn();
        const context = {
            fieldData: {
                path: '/sites/digitall/contents'
            },
            editorContext: {
                lang: 'fr'
            },
            dxContext: {
                contextPath: '',
                urlBrowser: '/cms/contentmanager'
            }
        };
        openInTabAction.onClick(context);

        expect(window.open).toHaveBeenCalledWith(`/cms/contentmanager/digitall/fr/${Constants.routes.baseEditRoute}/contents`, '_blank');
    });
});
