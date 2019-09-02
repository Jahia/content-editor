import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogActions
} from '@material-ui/core';
import {Search} from '@material-ui/icons';
import {Button, Typography} from '@jahia/design-system-kit';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {withApollo} from 'react-apollo';
import {useTreeOfNewContent} from './CreateNewContent.adapter';
import {ProgressOverlay} from '@jahia/react-material';
import {Input} from '../../DesignSystem/Input';

import {TreeView} from '../../DesignSystem/TreeView';

const styles = theme => ({
    treeContainer: {
        border: `1px solid ${theme.palette.ui.omega}`,
        backgroundColor: theme.palette.field.alpha,
        overflow: 'auto',
        height: '100%',
        minHeight: '20vh',
        minWidth: '30vw',
        margin: '0 24px',
        padding: theme.spacing.unit
    },
    filterInput: {
        margin: '0 24px 12px 24px'
    }
});

const CreateNewContentDialogCmp = ({open, onExited, onClose, onCreateContent, uiLang, client, classes, t}) => {
    const {tree, error, loading} = useTreeOfNewContent({
        uiLang: uiLang
    }, client);

    const [selectedType, setSelectedType] = useState(null);
    const [filter, setFilter] = useState();

    if (loading) {
        return <ProgressOverlay/>;
    }

    if (error) {
        console.error(error);
        return <>{error}</>;
    }

    // Filtering the tree
    const filteredTree = tree
        .map(category => {
            const filteredNodes = filter ? category.childs.filter(node => {
                return node.id.toLowerCase().includes(filter) || node.label.toLowerCase().includes(filter);
            }) : category.childs;

            // Never close selected content category
            const isCategorySelected = selectedType ? category.id === selectedType.parent.name : null;

            return {
                ...category,
                opened: filter ? true : (category.opened || isCategorySelected),
                childs: filteredNodes.map(node => {
                    return {
                        ...node,
                        selected: isCategorySelected && selectedType.id === node.id
                    };
                })
            };
        })
        .filter(category => category.childs.length !== 0);

    return (
        <Dialog open={open} aria-labelledby="dialog-createNewContent" onExited={onExited} onClose={onClose}>
            <DialogTitle id="dialog-createNewContent">
                <Typography color="alpha" variant="delta">
                    {t('content-editor:label.contentEditor.CMMActions.createNewContent.label')}
                </Typography>
            </DialogTitle>

            <Input
                placeholder={t('content-editor:label.contentEditor.CMMActions.createNewContent.filterLabel')}
                className={classes.filterInput}
                variant={{interactive: <Search/>}}
                onChange={e => {
                    setFilter(e.target.value.toLowerCase());
                    setSelectedType(null);
                }}
                />

            <div className={classes.treeContainer}>
                <TreeView tree={filteredTree}
                          onNodeClick={node => {
                              if (!node.childs) {
                                setSelectedType(node);
                              }
                          }}/>
            </div>
            <DialogActions>
                <Button variant="secondary" onClick={onClose}>
                    {t('content-editor:label.contentEditor.CMMActions.createNewContent.btnDiscard')}
                </Button>
                <Button disabled={!selectedType}
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
    uiLang: 'en'
};

CreateNewContentDialogCmp.propTypes = {
    uiLang: PropTypes.string,
    classes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired,
    onCreateContent: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export const CreateNewContentDialog = compose(
    translate(),
    withApollo,
    withStyles(styles)
)(CreateNewContentDialogCmp);
