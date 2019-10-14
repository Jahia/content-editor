import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import {MediaPickerEmpty} from './MediaPickerEmpty/MediaPickerEmpty';
import {MediaPickerFilled} from './MediaPickerFilled/MediaPickerFilled';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';

const MediaPickerCmp = ({field, value, id, editorContext, formik, setActionContext}) => {
    if (value) {
        return (
            <MediaPickerFilled
                id={id}
                uuid={value}
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
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    setActionContext: PropTypes.func.isRequired
};

export const MediaPicker = connect(MediaPickerCmp);
