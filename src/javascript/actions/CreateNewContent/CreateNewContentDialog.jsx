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

import {TreeView} from '../../DesignSystem/TreeView';

const treeProps = {
    tree: [
        {id: 'A',
            label: 'A level1',
            iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
            childs: [
                {id: 'A1', label: 'A-1 level2', iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'},
                {id: 'A2', label: 'A-2 level2'},
                {id: 'A3', label: 'A-3 level2'},
                {id: 'A4', label: 'A-4 level2'}
            ]
        },
        {id: 'B',
            label: 'B level1',
            iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
            childs: [
                {id: 'B1', label: 'B-1 level2'},
                {id: 'B2', label: 'B-2 level2'},
                {id: 'B3', label: 'B-3 level2'},
                {id: 'B4', label: 'B-4 level2', childs: [
                    {id: 'B11', label: 'B-1-1 level3'},
                    {id: 'B22', label: 'B-2-2 level3', iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'},
                    {id: 'B33', label: 'B-3-3 level3'},
                    {id: 'B44', label: 'B-4-4 level3'}
                ]}
            ]
        },
        {
            id: 'C',
            label: 'C level1',
            iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
            childs: []
        },
        {
            id: 'D',
            label: 'D level1',
            iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'
        }
    ]
};

const styles = theme => ({
    treeContainer: {
        border: `1px solid ${theme.palette.ui.omega}`,
        backgroundColor: theme.palette.field.alpha,
        overflow: 'auto',
        maxHeight: '30vh',
        minWidth: '30vw',
        margin: '0 24px',
        padding: theme.spacing.unit
    }
});

const CreateNewContentDialogCmp = ({classes, t}) => {
    const [isOpen, setIsOpen] = useState(true);
    const closeModal = () => setIsOpen(false);

    return (
        <Dialog open={isOpen} aria-labelledby="dialog-createNewContent" onBackdropClick={closeModal}>
            <DialogTitle id="dialog-createNewContent">
                {t('content-editor:label.contentEditor.CMMActions.createNewContent.label')}
            </DialogTitle>
            <div className={classes.treeContainer}>
                <TreeView {...treeProps}/>
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

CreateNewContentDialogCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
};

export const CreateNewContentDialog = compose(
    translate(),
    withStyles(styles)
)(CreateNewContentDialogCmp);
