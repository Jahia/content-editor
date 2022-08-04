import {OpenInTabActionComponent} from './openInTabAction';
import {Constants} from '~/ContentEditor.constants';
import {shallow} from '@jahia/test-framework';
import React from 'react';

const button = () => <button type="button"/>;

describe('openInTab action', () => {
    it('should open in new tab on click', () => {
        window.open = jest.fn();

        global.contextJsParameters = {
            contextPath: '',
            urlbase: '/jahia/jahia'
        };

        const context = {
            inputContext: {
                actionContext: {
                    fieldData: [{
                        uuid: 'this-is-an-id'
                    }],
                    editorContext: {
                        lang: 'fr'
                    }
                }
            }
        };

        const cmp = shallow(<OpenInTabActionComponent {...context} render={button}/>);
        cmp.simulate('click');

        expect(window.open).toHaveBeenCalledWith(`/jahia/jahia/${Constants.appName}/fr/${Constants.routes.baseEditRoute}/this-is-an-id`, '_blank');
    });
});
