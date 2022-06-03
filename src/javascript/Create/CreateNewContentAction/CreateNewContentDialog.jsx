import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogActions, DialogTitle} from '@material-ui/core';
import {Input} from '@jahia/design-system-kit';
import {Button, Search, Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';

import {TreeView} from '~/DesignSystem/TreeView';
import {useApolloClient, useQuery} from '@apollo/react-hooks';
import {getTreeOfContent} from '~/Create/CreateNewContentAction/CreateNewContent.gql-queries';
import {filterTree, isOpenableEntry} from './CreateNewContent.utils';
import styles from './CreateNewContentDialog.scss';

export const CreateNewContentDialog = ({childNodeName, nodeTypes, includeSubTypes, open, parentPath, onExited, onClose, onCreateContent, uilang}) => {
    const {t} = useTranslation('content-editor');
    const client = useApolloClient();
    const variables = {
        childNodeName: childNodeName,
        nodeTypes: nodeTypes.length > 0 ? nodeTypes : undefined,
        includeSubTypes,
        uilang: uilang,
        path: parentPath,
        excludedNodeTypes: ['jmix:studioOnly', 'jmix:hiddenType']
    };
    const {data, error, loading} = useQuery(getTreeOfContent, {variables, client});
    const [selectedType, setSelectedType] = useState(null);
    const [filter, setFilter] = useState();

    if (error) {
        throw error;
    }

    if (loading || !data || !data.forms) {
        return <ProgressOverlay/>;
    }

    // Filtering the tree
    const filteredTree = filterTree(data.forms.contentTypesAsTree, selectedType, filter);
    return (
        <Dialog open={open} aria-labelledby="dialog-createNewContent" onExited={onExited} onClose={onClose}>
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
                    tree={filteredTree}
                    onNodeClick={node => {
                        if (!isOpenableEntry(node)) {
                            setSelectedType(node);
                        }
                    }}
                    onNodeDoubleClick={node => {
                        if (!isOpenableEntry(node)) {
                            onCreateContent(node);
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

CreateNewContentDialog.defaultProps = {
    childNodeName: undefined,
    nodeTypes: [],
    includeSubTypes: false,
    uilang: 'en'
};

CreateNewContentDialog.propTypes = {
    childNodeName: PropTypes.string,
    nodeTypes: PropTypes.array,
    includeSubTypes: PropTypes.bool,
    uilang: PropTypes.string,
    parentPath: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired,
    onCreateContent: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
