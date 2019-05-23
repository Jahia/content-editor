import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import {ContentPickerEmpty} from './ContentPickerEmpty/ContentPickerEmpty';
import {ContentPickerFilled} from './ContentPickerFilled/ContentPickerFilled';

const ContentPickerCmp = ({field, id, editorContext, formik}) => {
    const uuid = formik.values[field.formDefinition.name];
    if (uuid) {
        return (
            <ContentPickerFilled id={id}
                                 uuid={uuid}
                                 field={field}
                                 editorContext={editorContext}
            />
        );
    }

    return (
        <ContentPickerEmpty id={id}
                            field={field}
                            formik={formik}
                            editorContext={editorContext}
        />
    );
};

ContentPickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};

export const ContentPicker = connect(ContentPickerCmp);
