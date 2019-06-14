import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ImageListQuery} from './ImageListQuery';
import {PickerDialog} from '../../../../../../../DesignSystem/PickerDialog';

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
    initialPath,
    field
}) => {
    return (
        <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
            <PickerDialog
                idInput={id}
                site={editorContext.site}
                lang={editorContext.lang}
                initialPath={initialPath}
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
                        image[0].uuid,
                        true
                    );
                    setIsOpen(false);
                }}
            >
                {(setSelectedItem, selectedPath) => (
                    <ImageListQuery
                        field={field}
                        setSelectedItem={setSelectedItem}
                        selectedPath={selectedPath}
                        formik={formik}
                    />
                )}
            </PickerDialog>
        </Dialog>
    );
};

MediaPickerDialog.defaultProps = {
    initialPath: null
};

MediaPickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    formik: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    initialPath: PropTypes.string
};
