import {OpenInTabActionComponent} from './openInTabAction';
import {shallow} from '@jahia/test-framework';
import React from 'react';
import {setQueryResponseMock} from '@apollo/react-hooks';
import {useContentEditorContext} from '~/contexts';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock;
    return {
        useApolloClient: jest.fn(),
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});

jest.mock('~/contexts/ContentEditor/ContentEditor.context');

jest.mock('@jahia/jcontent', () => ({
    jcontentUtils: {
        expandTree: () => ({
            then: cb => cb({})
        }),
        buildUrl: () => '/jcontent/url'
    }
}));

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
                    }]
                }
            }
        };
        const contentEditorContext = {
            lang: 'fr'
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
        setQueryResponseMock({
            loading: false,
            data: {jcr: {result: {uuid: 'this-is-an-id', site: {uuid: 'site-id', name: 'site-name'}}}}
        });
        const cmp = shallow(<OpenInTabActionComponent {...context} render={button}/>);
        cmp.simulate('click');

        expect(window.open).toHaveBeenCalledWith('/jahia/jahia/jcontent/url#(contentEditor:!((isFullscreen:!t,lang:fr,mode:edit,uuid:this-is-an-id)))', '_blank');
    });
});
