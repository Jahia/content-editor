import {MediaPickerConfig} from './MediaPickerConfig';
import {setQueryResponseMock} from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock;
    return {
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});

describe('MediaPicker config', () => {
    describe('usePickerInputData', () => {
        const usePickerInputData = MediaPickerConfig.pickerInput.usePickerInputData;
        window.contextJsParameters = {
            contextPath: 'localContextPath'
        };

        it('should return no data, no error when loading', () => {
            setQueryResponseMock({loading: true});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: true, notFound: true});
        });

        it('should return no data when there is no uuid given', () => {
            setQueryResponseMock({loading: false, data: {}});
            expect(usePickerInputData('', {lang: 'fr'})).toEqual({loading: false, notFound: false});
        });

        it('should return error when there is error', () => {
            setQueryResponseMock({loading: false, error: 'oops'});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: false, error: 'oops', notFound: true});
        });

        it('should return not found when the resource has been removed', () => {
            setQueryResponseMock({loading: false, data: undefined, error: undefined});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: false, notFound: true});
        });

        it('should adapt data when graphql return some data', () => {
            setQueryResponseMock({loading: false, data: {
                jcr: {
                    result: {
                        height: {value: '1080'},
                        width: {value: '1920'},
                        lastModified: {value: 'tomorow'},
                        displayName: 'a cake',
                        path: 'placeholder.jpg',
                        children: {
                            nodes: [{
                                mimeType: {value: 'image/jpeg'}
                            }]
                        }
                    }
                }
            }});

            expect(usePickerInputData('placeholder.jpg', {lang: 'fr'})).toEqual({
                loading: false,
                error: undefined,
                fieldData: {
                    info: 'image/jpeg - 1080x1920px',
                    name: 'a cake',
                    path: 'placeholder.jpg',
                    url: 'localContextPath/files/defaultplaceholder.jpg?lastModified=tomorow&t=thumbnail2'
                }
            });
        });
    });
});
