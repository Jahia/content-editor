import {useQuery} from '@apollo/react-hooks';
import {MediaPickerFilledQuery} from './MediaPicker.gql-queries';
import {useContentEditorContext} from '~/contexts';

export const useMediaPickerInputData = uuids => {
    const {lang} = useContentEditorContext();

    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuids: uuids || [],
            language: lang
        },
        skip: !uuids,
        errorPolicy: 'ignore'
    });

    if (loading || error || !data || !data.jcr || !uuids || (data.jcr.result.length === 0 && uuids.length > 0)) {
        return {error, loading, notFound: Boolean(uuids)};
    }

    const fieldData = data.jcr.result.map(imageData => {
        const sizeInfo = (imageData.height && imageData.width) ? ` - ${parseInt(imageData.width.value, 10)}x${parseInt(imageData.height.value, 10)}px` : '';
        const url = imageData.thumbnailUrl + (imageData.thumbnailUrl.indexOf('?') > 0 ? '&' : '?') + 'lastModified=' + imageData.lastModified?.value;
        return {
            uuid: imageData.uuid,
            url,
            name: imageData.displayName,
            path: imageData.path,
            info: `${imageData.content && imageData.content?.mimeType?.value}${sizeInfo}`
        };
    });

    return {fieldData, error, loading};
};
