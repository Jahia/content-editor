import {openInTabAction} from './openInTab.action';

describe('openInTab action', () => {
    it('should open in new tab on click', () => {
        window.open = jest.fn();
        const context = {
            fieldData: {
                path: '/sites/digitall/contents'
            },
            editorContext: {
                lang: 'fr'
            }
        };
        openInTabAction.onClick(context);

        expect(window.open).toHaveBeenCalledWith('/cms/contentmanager/digitall/fr/edit/contents', '_blank');
    });
});
