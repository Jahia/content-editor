import {useQuery} from '@apollo/react-hooks';
import {MediaPickerFilledQuery} from './MediaPicker.gql-queries';
import {encodeJCRPath} from '~/utils';
import {useContentEditorContext} from '~/contexts';

export const useMediaPickerInputData = uuids => {
    const {lang} = useContentEditorContext();

    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuids: uuids || [],
            language: lang
        },
        skip: !uuids
    });

    if (loading || error || !data || !uuids) {
        return {error, loading, notFound: Boolean(uuids)};
    }

    const fieldData = data.jcr.result.map(imageData => {
        const sizeInfo = (imageData.height && imageData.width) ? ` - ${parseInt(imageData.height.value, 10)}x${parseInt(imageData.width.value, 10)}px` : '';
        return {
            uuid: imageData.uuid,
            url: `${
                window.contextJsParameters.contextPath
            }/files/default${encodeJCRPath(imageData.path)}?lastModified=${imageData.lastModified.value}&t=thumbnail2`,
            name: imageData.displayName,
            path: imageData.path,
            info: `${imageData.content.mimeType.value}${sizeInfo}`
        };
    });

    return {fieldData, error, loading};
};
