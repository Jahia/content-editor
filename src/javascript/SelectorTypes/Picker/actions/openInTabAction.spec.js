import {OpenInTabActionComponent} from './openInTabAction';
import {Constants} from '~/ContentEditor.constants';
import {shallow} from '@jahia/test-framework';
import React from 'react';
import {setQueryResponseMock} from '@apollo/react-hooks';
import {useContentEditorContext} from '~/contexts';
import {useSelector} from 'react-redux';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock;
    return {
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});

jest.mock('~/contexts/ContentEditor/ContentEditor.context');

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

const button = () => <button type="button"/>;

describe('openInTab action', () => {
    beforeEach(() => {
        useSelector.mockImplementation(callback => callback({
            contenteditor: {
                ceLang: 'fr'
            }
        }));
    });

    afterEach(() => {
        useSelector.mockClear();
    });

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
                    }]
                }
            }
        };
        const contentEditorContext = {
            lang: 'fr'
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
        setQueryResponseMock({loading: false});
        const cmp = shallow(<OpenInTabActionComponent {...context} render={button}/>);
        cmp.simulate('click');

        expect(window.open).toHaveBeenCalledWith(`/jahia/jahia/${Constants.appName}/fr/${Constants.routes.baseEditRoute}/this-is-an-id`, '_blank');
    });
});
