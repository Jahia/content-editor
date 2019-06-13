import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ContentTable} from './ContentTable';
import {PickerDialog} from '../../../../../../DesignSystem/PickerDialog';

import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

export const ContentPickerDialog = ({
    isOpen,
    setIsOpen,
    editorContext,
    id,
    nodeTreeConfigs,
    t,
    formik,
    field,
    pickerConfig
}) => {
    return (
        <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
            <PickerDialog
                idInput={id}
                site={editorContext.site}
                lang={editorContext.lang}
                nodeTreeConfigs={nodeTreeConfigs}
                modalCancelLabel={t(
                    'content-editor:label.contentEditor.edit.fields.modalCancel'
                )}
                modalDoneLabel={t(
                    'content-editor:label.contentEditor.edit.fields.modalDone'
                )}
                onCloseDialog={() => setIsOpen(false)}
                onItemSelection={content => {
                    formik.setFieldValue(
                        field.formDefinition.name,
                        content[0].id,
                        true
                    );
                    setIsOpen(false);
                }}
            >
                {(setSelectedItem, selectedPath) => {
                    // Build table config from picker config
                    /*
       Todo: make the picker work as CMM, use the recursionTypesFilter to browse all contents within a page
        without displaying the content lists.
       let isContentOrFile =
            selectedPath === '/sites/' + editorContext.site + '/contents' ||
            selectedPath.startsWith('/sites/' + editorContext.site + '/contents/') ||
            selectedPath === '/sites/' + editorContext.site + '/files' ||
            selectedPath.startsWith('/sites/' + editorContext.site + '/files/');

        recursionTypesFilter: isContentOrFile ? ['nt:base'] : ['jnt:page', 'jnt:contentFolder']
        */

                    const tableConfig = {
                        typeFilter: pickerConfig.selectableTypesTable,
                        recursionTypesFilter: ['nt:base']
                    };

                    return (
                        <ContentTable
                            tableConfig={tableConfig}
                            setSelectedItem={setSelectedItem}
                            selectedPath={selectedPath}
                            formik={formik}
                            editorContext={editorContext}
                        />
                    );
                }}
            </PickerDialog>
        </Dialog>
    );
};

ContentPickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    formik: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    pickerConfig: PropTypes.object.isRequired
};
