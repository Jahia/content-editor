import {MediaPickerSelectorType} from './index';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock;
    return {
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});
import {setQueryResponseMock} from '@apollo/react-hooks';

describe('MediaPicker config', () => {
    describe('usePickerInputData', () => {
        const usePickerInputData = MediaPickerSelectorType.pickerInput.usePickerInputData;
        window.contextJsParameters = {
            contextPath: 'localContextPath'
        };

        it('should return no data, no error when loading', () => {
            setQueryResponseMock({loading: true});
            expect(usePickerInputData('uuid')).toEqual({loading: true});
        });

        it('should return no data when there is no uuid given', () => {
            setQueryResponseMock({loading: false, data: {}});
            expect(usePickerInputData('')).toEqual({loading: false});
        });

        it('should return error when there is error', () => {
            setQueryResponseMock({loading: false, error: 'oops'});
            expect(usePickerInputData('uuid')).toEqual({loading: false, error: 'oops'});
        });

        it('should adapt data when graphql return some data', () => {
            setQueryResponseMock({loading: false, data: {
                jcr: {
                    result: {
                        height: {value: '1080'},
                        width: {value: '1920'},
                        lastModified: {value: 'tomorow'},
                        name: 'a cake',
                        path: 'placeholder.jpg',
                        children: {
                            nodes: [{
                                mimeType: {value: 'image/jpeg'}
                            }]
                        }
                    }
                }
            }});

            expect(usePickerInputData('uuid')).toEqual({
                loading: false,
                error: undefined,
                fieldData: {
                    info: 'image/jpeg - 1080x1920px',
                    name: 'a cake',
                    path: 'placeholder.jpg',
                    url: 'localContextPath/files/defaultplaceholder.jpg?lastModified=tomorow'
                }
            });
        });
    });
});
