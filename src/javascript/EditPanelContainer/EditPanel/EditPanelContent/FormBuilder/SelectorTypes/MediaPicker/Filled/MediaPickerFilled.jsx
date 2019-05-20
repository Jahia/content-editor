import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {FieldPickerFilled} from '../../../../../../../DesignSystem/FieldPicker';
import {encodeJCRPath} from '../../../../../EditPanel.utils';
import {MediaPickerFilledQuery} from './MediaPickerFilled.gql-queries';
import {useQuery} from 'react-apollo-hooks';

const MediaPickerFilledCmp = ({t, field, id, uuid}) => {
    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuid: uuid
        }
    });

    if (error) {
        const message = t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')});
        return (<>{message}</>);
    }

    if (loading) {
        return (<ProgressOverlay/>);
    }

    const imageData = data.jcr.result;
    const fieldData = {
        url: `${window.contextJsParameters.contextPath}/files/default${encodeJCRPath(imageData.path)}`,
        name: imageData.name,
        info: `${imageData.children.nodes[0].mimeType.value} - ${parseInt(imageData.height.value, 10)}x${parseInt(imageData.width.value, 10)}px - 1.2mb`
    };

    return (
        <FieldPickerFilled field={field}
                           fieldData={fieldData}
                           selectedId={uuid}
                           id={id}
        />
    );
};

MediaPickerFilledCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export const MediaPickerFilled = translate()(MediaPickerFilledCmp);
