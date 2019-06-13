import {InsertDriveFile} from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Picker} from '../../../../../../../DesignSystem/Picker';
import {translate} from 'react-i18next';
import {ContentPickerDialog} from '../ContentPickerDialog';

const ContentPickerEmptyCmp = ({
    t,
    id,
    field,
    formik,
    editorContext,
    nodeTreeConfigs,
    pickerConfig
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Picker
                readOnly={field.formDefinition.readOnly}
                emptyLabel={t(
                    'content-editor:label.contentEditor.edit.fields.contentPicker.addContent'
                )}
                emptyIcon={<InsertDriveFile/>}
                onClick={() => setIsOpen(!isOpen)}
            />
            <ContentPickerDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editorContext={editorContext}
                id={id}
                nodeTreeConfigs={nodeTreeConfigs}
                t={t}
                formik={formik}
                field={field}
                pickerConfig={pickerConfig}
            />
        </>
    );
};

ContentPickerEmptyCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    pickerConfig: PropTypes.object.isRequired
};

export const ContentPickerEmpty = translate()(ContentPickerEmptyCmp);
