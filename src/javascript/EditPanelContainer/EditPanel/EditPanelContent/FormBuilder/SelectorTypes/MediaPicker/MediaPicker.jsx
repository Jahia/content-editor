import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';

import {MediaPickerEmpty} from './MediaPicker_empty';
import {MediaPickerFilled} from './MediaPicker_filled';

const MediaPickerCmp = ({field, id, editorContext, formik}) => {
    if (!formik.values[field.formDefinition.name]) {
        return <MediaPickerEmpty idInput={id} editorContext={editorContext}/>;
    }

    return <MediaPickerFilled field={field} id={id}/>;
};

MediaPickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};

export const MediaPicker = connect(MediaPickerCmp);
