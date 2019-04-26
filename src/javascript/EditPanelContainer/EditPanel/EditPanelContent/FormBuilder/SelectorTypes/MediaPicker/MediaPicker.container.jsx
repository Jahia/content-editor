import React from 'react';
import PropTypes from 'prop-types';
import {MediaPicker, MediaPickerEmpty} from './components';

const MediaPickerContainer = ({field, id, editorContext}) => {
    if (!field.data || !field.data.value) {
        return <MediaPickerEmpty idInput={id} editorContext={editorContext}/>;
    }

    return <MediaPicker field={field} id={id}/>;
};

MediaPickerContainer.propTypes = {
    editorContext: PropTypes.object.isRequired,
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

export {MediaPickerContainer};
