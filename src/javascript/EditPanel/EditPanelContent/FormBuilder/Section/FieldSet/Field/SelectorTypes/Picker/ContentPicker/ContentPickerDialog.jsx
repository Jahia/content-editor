import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ContentTable} from './ContentTable';
import {PickerDialog} from '~/DesignSystem/PickerDialog';

import Slide from '@material-ui/core/Slide';
import {FastField} from 'formik';

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

export const ContentPickerDialog = ({
    isOpen,
    setIsOpen,
    initialSelectedItem,
    editorContext,
    id,
    field,
    nodeTreeConfigs,
    t,
    pickerConfig
}) => {
    return (
        <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
            <FastField render={({form: {setFieldValue, setFieldTouched}}) => (
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
                    setFieldValue(
                        id,
                        content[0] ? content[0].id : null,
                        true
                    );
                    setIsOpen(false);
                    setFieldTouched(field.name, field.multiple ? [true] : true);
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
                        recursionTypesFilter: ['nt:base'],
                        showOnlyNodesWithTemplates: pickerConfig.showOnlyNodesWithTemplates
                    };

                    return (
                        <ContentTable
                            tableConfig={tableConfig}
                            setSelectedItem={setSelectedItem}
                            selectedPath={selectedPath}
                            initialSelection={initialSelection}
                            editorContext={editorContext}
                        />
                    );
                }}
                </PickerDialog>
)}/>
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
    field: PropTypes.object.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    initialSelectedItem: PropTypes.string
};
