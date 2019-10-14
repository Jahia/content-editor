import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ImageListQuery} from './ImageListQuery';
import {PickerDialog} from '~/DesignSystem/PickerDialog';

import Slide from '@material-ui/core/Slide';
import {FastField} from 'formik';

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

export const MediaPickerDialog = ({
    isOpen,
    setIsOpen,
    editorContext,
    id,
    field,
    t,
    initialSelectedItem
}) => {
    return (
        <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
            <FastField render={({form}) => (
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
                    form.setFieldValue(
                        id,
                        image[0] ? image[0].uuid : null,
                        true
                    );
                    setIsOpen(false);
                    form.setFieldTouched(field.name, field.multiple ? [true] : true);
                }}
                >
                    {(setSelectedItem, selectedPath, initialSelection) => (
                        <ImageListQuery
                        id={id}
                        setSelectedItem={setSelectedItem}
                        selectedPath={selectedPath}
                        initialSelection={initialSelection}
                        formik={form}
                        field={field}
                    />
                )}
                </PickerDialog>
            )}/>
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
    field: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    initialSelectedItem: PropTypes.string
};
