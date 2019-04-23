import React from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import {Typography} from '@jahia/ds-mui-theme';

const TreeView = () => 'TODO TreeView';

import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';

const styles = theme => ({
    drawerPaper: {
        width: '15vw',
        backgroundColor: theme.palette.ui.beta
    },
    modalContent: {
        width: '100%',
        minHeight: '100vh',
        paddingLeft: '15vw'
    },
    selectImg: {
        height: '30vh',
        width: '30vh'
    },
    actions: {
        position: 'fixed',
        width: '85vw',
        backgroundColor: theme.palette.ui.epsilon,
        bottom: 0,
        padding: theme.spacing.unit * 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    actionButtons: {
        '& button': {
            marginRight: theme.spacing.unit * 2
        }
    },
    actionUpload: {
        display: 'flex',
        alignItems: 'center',
        '& label': {
            marginLeft: '0.7rem'
        },
        '& input': {
            display: 'none'
        }
    }
});

export const ModalCmp = ({onCloseDialog, classes, idInput, t}) => {
    return (
        <>
            <Drawer
                open
                component="nav"
                variant="permanent"
                anchor="left"
                classes={{
                 paper: classes.drawerPaper
               }}
            >
                <TreeView/>
            </Drawer>
            <main className={classes.modalContent}>
                <section className={classes.selectImg}>
                    <img src="https://www.fillmurray.com/200/300"/>
                    <img src="https://www.fillmurray.com/300/300"/>
                </section>

                <div className={classes.actions}>
                    <div className={classes.actionUpload}>
                        <CloudUpload/>
                        <Typography>drag and drop your files here, or</Typography>
                        <label>
                            <Typography>Browse your computer</Typography>
                            <input type="file" id={idInput}/>
                        </label>
                    </div>
                    <div className={classes.actionButtons}>
                        <Button type="button" color="secondary" onClick={onCloseDialog}>
                            {t(
                                'content-editor:label.contentEditor.edit.fields.imagePicker.modalCancel'
                            )}
                        </Button>
                        <Button disabled variant="contained" color="primary" type="button">
                            {t(
                                'content-editor:label.contentEditor.edit.fields.imagePicker.modalDone'
                            )}
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
};

ModalCmp.defaultProps = {
    classes: {}
};

ModalCmp.propTypes = {
    t: PropTypes.func.isRequired,
    idInput: PropTypes.string.isRequired,
    classes: PropTypes.object,
    onCloseDialog: PropTypes.func.isRequired
};

export const Modal = compose(
    translate(),
    withStyles(styles)
)(ModalCmp);
