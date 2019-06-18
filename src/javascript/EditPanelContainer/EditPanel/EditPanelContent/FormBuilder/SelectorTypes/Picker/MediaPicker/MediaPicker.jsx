import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import {MediaPickerEmpty} from './MediaPickerEmpty/MediaPickerEmpty';
import {MediaPickerFilled} from './MediaPickerFilled/MediaPickerFilled';

const MediaPickerCmp = ({field, id, editorContext, formik, setActionContext}) => {
    const uuid = formik.values[field.formDefinition.name];
    if (uuid) {
        return (
            <MediaPickerFilled
                id={id}
                uuid={uuid}
                field={field}
                formik={formik}
                editorContext={editorContext}
                setActionContext={setActionContext}
            />
        );
    }

    return (
        <MediaPickerEmpty
            id={id}
            field={field}
            formik={formik}
            editorContext={editorContext}
            setActionContext={setActionContext}
        />
    );
};

MediaPickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const MediaPicker = connect(MediaPickerCmp);
