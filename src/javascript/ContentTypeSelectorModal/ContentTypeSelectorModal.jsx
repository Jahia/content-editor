import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogActions, DialogTitle} from '@material-ui/core';
import {Input} from '@jahia/design-system-kit';
import {Button, Search, Typography, TreeView} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';

import {filterTree, isOpenableEntry} from './ContentTypeSelectorModal.utils';
import styles from './ContentTypeSelectorModal.scss';

export const ContentTypeSelectorModal = ({nodeTypesTree, open, onExited, onClose, onCreateContent}) => {
    const {t} = useTranslation('content-editor');
    const [selectedType, setSelectedType] = useState(null);
    const [filter, setFilter] = useState();

    // Filtering the tree
    const filteredTree = filterTree(nodeTypesTree, selectedType, filter);

    return (
        <Dialog classes={{paper: styles.modalRoot}} open={open} aria-labelledby="dialog-createNewContent" onExited={onExited} onClose={onClose}>
            <DialogTitle className={styles.dialogTitle} id="dialog-createNewContent">
                <Typography variant="heading">
                    {t('content-editor:label.contentEditor.CMMActions.createNewContent.labelModal')}
                </Typography>
            </DialogTitle>

            <Input
                autoFocus
                data-sel-role="content-type-dialog-input"
                placeholder={t('content-editor:label.contentEditor.CMMActions.createNewContent.filterLabel')}
                className={styles.filterInput}
                variant={{interactive: <Search/>}}
                onChange={e => {
                    setFilter(e.target.value.toLowerCase());
                    setSelectedType(null);
                }}
            />

            <div className={styles.treeContainer} data-sel-role="content-type-tree">
                <TreeView
                    data={filteredTree}
                    selectedItems={selectedType ? [selectedType.id] : []}
                    openedItems={filter ? filteredTree.map(n => n.id) : undefined}
                    onClickItem={(item, ev, toggle) => {
                        if (!isOpenableEntry(item)) {
                            setSelectedType(item);
                        } else if (!filter) {
                            if (selectedType && selectedType.parent.id === item.id) {
                                setSelectedType(null);
                            }

                            toggle();
                        }
                    }}
                    onDoubleClickItem={item => {
                        if (!isOpenableEntry(item)) {
                            onCreateContent(item);
                        }
                    }}
                />
            </div>
            <DialogActions>
                <Button
                    data-sel-role="content-type-dialog-cancel"
                    variant="outlined"
                    size="big"
                    label={t('content-editor:label.contentEditor.CMMActions.createNewContent.btnDiscard')}
                    onClick={onClose}
                />
                <Button
                    data-sel-role="content-type-dialog-create"
                    disabled={!selectedType}
                    color="accent"
                    size="big"
                    label={t('content-editor:label.contentEditor.CMMActions.createNewContent.btnCreate')}
                    onClick={() => {
                        onCreateContent(selectedType);
                    }}
                />
            </DialogActions>
        </Dialog>
    );
};

ContentTypeSelectorModal.propTypes = {
    nodeTypesTree: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired,
    onCreateContent: PropTypes.func.isRequired
};
