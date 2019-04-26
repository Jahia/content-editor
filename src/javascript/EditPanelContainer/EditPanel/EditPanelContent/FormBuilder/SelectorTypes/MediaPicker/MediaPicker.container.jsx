import React from 'react';
import PropTypes from 'prop-types';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {compose, withApollo} from 'react-apollo';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import MediaPicker from './components';
import {MediaPickerQuery} from './MediaPicker.gql-queries';

const MediaPickerContainer = ({t, field, id}) => {
    const {data, error, loading} = useQuery(MediaPickerQuery, {
        variables: {
            uuid: field.data.value
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
        data: {
            value: field.data.value
        },
        imageData: {
            url: `${window.contextJsParameters.contextPath}/files/default${imageData.path}`,
            name: imageData.name,
            size: [parseInt(imageData.height.value, 10), parseInt(imageData.width.value, 10)],
            weight: 1.2,
            type: imageData.children.nodes[0].mimeType.value
        }
    };

    return (
        <MediaPicker field={fieldData} id={id}/>
    );
};

MediaPickerContainer.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.shape({
        data: PropTypes.shape({
            value: PropTypes.string
        }),
        imageData: PropTypes.shape({
            url: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            size: PropTypes.arrayOf(PropTypes.number).isRequired,
            weight: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired
        })
    }).isRequired,
    id: PropTypes.string.isRequired
};

const MediaPickerCtr = compose(
    withNotifications(),
    translate(),
    withApollo
)(MediaPickerContainer);

export {MediaPickerCtr};
