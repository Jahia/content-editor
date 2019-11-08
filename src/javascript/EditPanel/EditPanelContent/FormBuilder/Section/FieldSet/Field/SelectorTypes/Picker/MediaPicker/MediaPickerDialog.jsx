import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ImageListQuery} from './ImageListQuery';
import {PickerDialog} from '~/DesignSystem/PickerDialog';

import Slide from '@material-ui/core/Slide';
import {FastField} from 'formik';
import {withStyles} from '@material-ui/core';

const styles = theme => ({
    rootDialog: {
        margin: theme.spacing.unit * 8
    }
});

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const MediaPickerDialog = ({
    classes,
    isOpen,
    setIsOpen,
    editorContext,
    id,
    field,
    t,
    initialSelectedItem
}) => {
    return (
        <Dialog
            fullScreen
            classes={{root: classes.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={() => setIsOpen(false)}
        >
            <FastField render={({form}) => {
                const onItemSelection = image => {
                    form.setFieldValue(
                        id,
                        image ? image.uuid : null,
                        true
                    );
                    setIsOpen(false);
                    form.setFieldTouched(field.name, field.multiple ? [true] : true);
                };

                return (
                    <PickerDialog
                        idInput={id}
                        site={editorContext.site}
                        lang={editorContext.lang}
                        initialSelectedItem={initialSelectedItem}
                        nodeTreeConfigs={[
                            {
                                rootPath: `/sites/${editorContext.site}/files`,
                                selectableTypes: ['jnt:folder'],
                                type: 'files',
                                openableTypes: ['jnt:folder'],
                                rootLabel: t(
                                    'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'
                                ),
                                key: 'browse-tree-files'
                            }
                        ]}
                        modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                        modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                        onCloseDialog={() => setIsOpen(false)}
                        onItemSelection={onItemSelection}
                    >
                        {(setSelectedItem, selectedPath, initialSelection) => (
                            <ImageListQuery
                                setSelectedItem={setSelectedItem}
                                selectedPath={selectedPath}
                                initialSelection={initialSelection}
                                onImageDoubleClick={onItemSelection}
                            />
                        )}
                    </PickerDialog>
                );
            }}/>
        </Dialog>
    );
};

MediaPickerDialog.defaultProps = {
    initialSelectedItem: null
};

MediaPickerDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    initialSelectedItem: PropTypes.string
};

export default withStyles(styles)(MediaPickerDialog);
