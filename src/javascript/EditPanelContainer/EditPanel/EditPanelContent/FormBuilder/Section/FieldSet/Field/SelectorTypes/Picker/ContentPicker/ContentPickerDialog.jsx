import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ContentTable} from './ContentTable';
import {PickerDialog} from '~design-system/PickerDialog';
import {FieldPropTypes} from '../../../../../../../../../FormDefinitions/FormData.proptypes';

import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

export const ContentPickerDialog = ({
    isOpen,
    setIsOpen,
    initialSelectedItem,
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
                initialSelectedItem={initialSelectedItem}
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
                        field.name,
                        content[0] ? content[0].id : null,
                        true
                    );
                    setIsOpen(false);
                }}
            >
                {(setSelectedItem, selectedPath, initialSelection) => {
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
                            initialSelection={initialSelection}
                            formik={formik}
                            editorContext={editorContext}
                        />
                    );
                }}
            </PickerDialog>
        </Dialog>
    );
};

ContentPickerDialog.defaultProps = {
    initialSelectedItem: null
};

ContentPickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    formik: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    initialSelectedItem: PropTypes.string
};
