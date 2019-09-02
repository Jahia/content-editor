import ImageIcon from '@material-ui/icons/Image';
import * as PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Picker} from '~design-system/Picker';
import {translate} from 'react-i18next';
import {FieldPropTypes} from '../../../../.././../../../../../FormDefinitions/FormData.proptypes';

import {MediaPickerDialog} from '../MediaPickerDialog';

const MediaPickerEmptyCmp = ({t, id, field, formik, editorContext, setActionContext}) => {
    const [isOpen, setIsOpen] = useState(false);

    setActionContext(prevActionContext => ({
        noAction: true,
        contextHasChange: !prevActionContext.noAction
    }));

    return (
        <>
            <Picker
                readOnly={field.readOnly}
                emptyLabel={t(
                    'content-editor:label.contentEditor.edit.fields.imagePicker.addImage'
                )}
                emptyIcon={<ImageIcon/>}
                onClick={() => setIsOpen(!isOpen)}
            />
            <MediaPickerDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editorContext={editorContext}
                id={id}
                t={t}
                formik={formik}
                field={field}
            />
        </>
    );
};

MediaPickerEmptyCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: FieldPropTypes.isRequired,
    editorContext: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const MediaPickerEmpty = translate()(MediaPickerEmptyCmp);
