import {useMediaPickerInputData} from './useMediaPickerInputData';
import {setQueryResponseMock} from '@apollo/react-hooks';
import {useContentEditorContext} from '~/contexts';

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

describe('useMediaPickerInputData', () => {
    let contentEditorContext;
    beforeEach(() => {
        contentEditorContext = {
            lang: 'fr'
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);
    });

    window.contextJsParameters = {
        contextPath: 'localContextPath'
    };

    it('should return no data, no error when loading', () => {
        setQueryResponseMock({loading: true});
        expect(useMediaPickerInputData('uuid', {lang: 'fr'})).toEqual({loading: true, notFound: true});
    });

    it('should return no data when there is no uuid given', () => {
        setQueryResponseMock({loading: false, data: {}});
        expect(useMediaPickerInputData('', {lang: 'fr'})).toEqual({loading: false, notFound: false});
    });

    it('should return error when there is error', () => {
        setQueryResponseMock({loading: false, error: 'oops'});
        expect(useMediaPickerInputData('uuid', {lang: 'fr'})).toEqual({loading: false, error: 'oops', notFound: true});
    });

    it('should return not found when the resource has been removed', () => {
        setQueryResponseMock({loading: false, data: undefined, error: undefined});
        expect(useMediaPickerInputData('uuid', {lang: 'fr'})).toEqual({loading: false, notFound: true});
    });

    it('should adapt data when graphql return some data', () => {
        setQueryResponseMock({loading: false, data: {
            jcr: {
                result: [{
                    uuid: 'this-is-uuid',
                    height: {value: '1080'},
                    width: {value: '1920'},
                    lastModified: {value: 'tomorrow'},
                    displayName: 'a cake',
                    path: 'placeholder.jpg',
                    content: {
                        mimeType: {value: 'image/jpeg'}
                    }
                }]
            }
        }});

        expect(useMediaPickerInputData('this-is-uuid', {lang: 'fr'})).toEqual({
            loading: false,
            error: undefined,
            fieldData: [{
                uuid: 'this-is-uuid',
                info: 'image/jpeg - 1080x1920px',
                name: 'a cake',
                path: 'placeholder.jpg',
                url: 'localContextPath/files/defaultplaceholder.jpg?lastModified=tomorrow&t=thumbnail2'
            }]
        });
    });
});
