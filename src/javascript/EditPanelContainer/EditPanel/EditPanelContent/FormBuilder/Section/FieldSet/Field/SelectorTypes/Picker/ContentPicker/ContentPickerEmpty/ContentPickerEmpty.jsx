import {InsertDriveFile} from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Picker} from '~DesignSystem/Picker';
import {translate} from 'react-i18next';
import {ContentPickerDialog} from '../ContentPickerDialog';
import {FieldPropTypes} from '../../../../../../../../../../FormDefinitions/FormData.proptypes';

const ContentPickerEmptyCmp = ({
    t,
    id,
    field,
    formik,
    editorContext,
    nodeTreeConfigs,
    pickerConfig,
    setActionContext
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Avoid infinite loop incase of multiple ref
    if (!field.multiple) {
        setActionContext(prevActionContext => ({
            noAction: true,
            contextHasChange: !prevActionContext.noAction
        }));
    }

    return (
        <>
            <Picker
                readOnly={field.readOnly}
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
    field: FieldPropTypes.isRequired,
    editorContext: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const ContentPickerEmpty = translate()(ContentPickerEmptyCmp);
