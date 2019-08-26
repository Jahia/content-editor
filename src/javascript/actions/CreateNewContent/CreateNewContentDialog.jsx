import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogActions
} from '@material-ui/core';
import {Button} from '@jahia/design-system-kit';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {withApollo} from 'react-apollo';
import {useTreeOfNewContent} from './CreateNewContent.adapter';
import {ProgressOverlay} from '@jahia/react-material';

import {TreeView} from '../../DesignSystem/TreeView';

const styles = theme => ({
    treeContainer: {
        border: `1px solid ${theme.palette.ui.omega}`,
        backgroundColor: theme.palette.field.alpha,
        overflow: 'auto',
        maxHeight: '60vh',
        minWidth: '30vw',
        margin: '0 24px',
        padding: theme.spacing.unit
    }
});

const CreateNewContentDialogCmp = ({uiLang, client, classes, t}) => {
    const [isOpen, setIsOpen] = useState(true);
    const closeModal = () => setIsOpen(false);

    const {tree, error, loading} = useTreeOfNewContent({
        uiLang: uiLang
    }, client);

    if (loading) {
        return <ProgressOverlay/>;
    }

    if (error) {
        console.error(error);
        return <>{error}</>;
    }

    return (
        <Dialog open={isOpen} aria-labelledby="dialog-createNewContent" onBackdropClick={closeModal}>
            <DialogTitle id="dialog-createNewContent">
                {t('content-editor:label.contentEditor.CMMActions.createNewContent.label')}
            </DialogTitle>
            <div className={classes.treeContainer}>
                <TreeView tree={tree}/>
            </div>
            <DialogActions>
                <Button variant="secondary" onClick={closeModal}>
                    {t('content-editor:label.contentEditor.CMMActions.createNewContent.btnDiscard')}
                </Button>
                <Button disabled variant="primary">
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
    t: PropTypes.func.isRequired
};

export const CreateNewContentDialog = compose(
    translate(),
    withApollo,
    withStyles(styles)
)(CreateNewContentDialogCmp);
