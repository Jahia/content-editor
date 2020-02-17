import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogActions, DialogTitle, withStyles} from '@material-ui/core';
import {Search} from '@material-ui/icons';
import {Button, Input, Typography} from '@jahia/design-system-kit';
import {useTranslation} from 'react-i18next';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {ProgressOverlay} from '@jahia/react-material';

import {TreeView} from '~/DesignSystem/TreeView';
import {useQuery} from '@apollo/react-hooks';
import {getTreeOfContent} from '~/Create/CreateNewContentAction/CreateNewContent.gql-queries';
import {filterTree} from './createNewContent.utits';

const styles = theme => ({
    treeContainer: {
        border: `1px solid ${theme.palette.ui.omega}`,
        backgroundColor: theme.palette.field.alpha,
        overflow: 'auto',
        height: '100vh',
        minHeight: '20vh',
        minWidth: '30vw',
        margin: '0 24px',
        padding: theme.spacing.unit
    },
    dialogTitle: {
        padding: theme.spacing.unit * 3
    },
    filterInput: {
        margin: '0 24px 24px 24px',
        padding: '3px 12px'
    }
});

const CreateNewContentDialogCmp = ({open, parentPath, onExited, onClose, onCreateContent, uilang, client, classes}) => {
    const {t} = useTranslation();
    const variables = {
        uilang: uilang,
        path: parentPath,
        excludedNodeTypes: ['jmix:studioOnly', 'jmix:hiddenType']
    };
    const {data, error, loading} = useQuery(getTreeOfContent, {variables, client});
    const [selectedType, setSelectedType] = useState(null);
    const [filter, setFilter] = useState();

    if (error) {
        console.error(error);
        return <>{error}</>;
    }

    if (loading || !data || !data.forms) {
        return <ProgressOverlay/>;
    }

    // Filtering the tree
    const filteredTree = filterTree(data.forms.contentTypesAsTree, selectedType, filter);
    return (
        <Dialog open={open} aria-labelledby="dialog-createNewContent" onExited={onExited} onClose={onClose}>
            <DialogTitle className={classes.dialogTitle} id="dialog-createNewContent">
                <Typography color="alpha" variant="delta">
                    {t('content-editor:label.contentEditor.CMMActions.createNewContent.labelModal')}
                </Typography>
            </DialogTitle>

            <Input
                autoFocus
                data-sel-role="content-type-dialog-input"
                placeholder={t('content-editor:label.contentEditor.CMMActions.createNewContent.filterLabel')}
                className={classes.filterInput}
                variant={{interactive: <Search/>}}
                onChange={e => {
                    setFilter(e.target.value.toLowerCase());
                    setSelectedType(null);
                }}
            />

            <div className={classes.treeContainer} data-sel-role="content-type-tree">
                <TreeView
                    tree={filteredTree}
                    onNodeClick={node => {
                        if (!node.nodeType.mixin) {
                            setSelectedType(node);
                        }
                    }}
                    onNodeDoubleClick={node => {
                        if (!node.nodeType.mixin) {
                            onCreateContent(node);
                        }
                    }}
                />
            </div>
            <DialogActions>
                <Button variant="secondary" data-sel-role="content-type-dialog-cancel" onClick={onClose}>
                    {t('content-editor:label.contentEditor.CMMActions.createNewContent.btnDiscard')}
                </Button>
                <Button
                    data-sel-role="content-type-dialog-create"
                    disabled={!selectedType}
                    variant="primary"
                    onClick={() => {
                        onCreateContent(selectedType);
                    }}
                >
                    {t('content-editor:label.contentEditor.CMMActions.createNewContent.btnCreate')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CreateNewContentDialogCmp.defaultProps = {
    uilang: 'en'
};

CreateNewContentDialogCmp.propTypes = {
    uilang: PropTypes.string,
    parentPath: PropTypes.string,
    classes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired,
    onCreateContent: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export const CreateNewContentDialog = compose(
    withApollo,
    withStyles(styles)
)(CreateNewContentDialogCmp);
