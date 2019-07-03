import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ImageListQuery} from './ImageListQuery';
import {PickerDialog} from '../../../../../../../DesignSystem/PickerDialog';
import {FieldPropTypes} from '../../../../../../FormDefinitions/FromData.proptypes';

import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

export const MediaPickerDialog = ({
    isOpen,
    setIsOpen,
    editorContext,
    id,
    t,
    formik,
    initialSelectedItem,
    field
}) => {
    return (
        <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
            <PickerDialog
                idInput={id}
                site={editorContext.site}
                lang={editorContext.lang}
                initialSelectedItem={initialSelectedItem}
                nodeTreeConfigs={[
                    {
                        rootPath: '/files',
                        selectableTypes: ['jnt:folder'],
                        type: 'files',
                        openableTypes: ['jnt:folder'],
                        rootLabel: t(
                            'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'
                        ),
                        key: 'browse-tree-files'
                    }
                ]}
                modalCancelLabel={t(
                    'content-editor:label.contentEditor.edit.fields.modalCancel'
                )}
                modalDoneLabel={t(
                    'content-editor:label.contentEditor.edit.fields.modalDone'
                )}
                onCloseDialog={() => setIsOpen(false)}
                onItemSelection={image => {
                    formik.setFieldValue(
                        field.formDefinition.name,
                        image[0] ? image[0].uuid : null,
                        true
                    );
                    setIsOpen(false);
                }}
            >
                {(setSelectedItem, selectedPath, initialSelection) => (
                    <ImageListQuery
                        field={field}
                        setSelectedItem={setSelectedItem}
                        selectedPath={selectedPath}
                        initialSelection={initialSelection}
                        formik={formik}
                    />
                )}
            </PickerDialog>
        </Dialog>
    );
};

MediaPickerDialog.defaultProps = {
    initialSelectedItem: null
};

MediaPickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    formik: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    initialSelectedItem: PropTypes.string
};
