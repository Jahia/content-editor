import React from 'react';
import PropTypes from 'prop-types';
import {MediaPickerEmpty} from './MediaPicker_empty';
import {MediaPickerFilled} from './MediaPicker_filled';

const MediaPicker = ({field, id, editorContext}) => {
    if (!field.data || !field.data.value) {
        return <MediaPickerEmpty idInput={id} editorContext={editorContext}/>;
    }

    return <MediaPickerFilled field={field} id={id}/>;
};

MediaPicker.propTypes = {
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

export {MediaPicker};
