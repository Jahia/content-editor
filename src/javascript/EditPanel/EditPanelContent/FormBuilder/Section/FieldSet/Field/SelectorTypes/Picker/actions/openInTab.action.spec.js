import {openInTabAction} from './openInTab.action';
import {Constants} from '~/ContentEditor.constants';

describe('openInTab action', () => {
    it('should open in new tab on click', () => {
        window.open = jest.fn();

        global.contextJsParameters = {
            contextPath: '',
            urlbase: '/jahia/jahia'
        };

        const context = {
            fieldData: {
                uuid: 'this-is-an-id'
            },
            editorContext: {
                lang: 'fr'
            }
        };
        openInTabAction.onClick(context);

        expect(window.open).toHaveBeenCalledWith(`/jahia/jahia/${Constants.appName}/fr/${Constants.routes.baseEditRoute}/this-is-an-id`, '_blank');
    });
});
