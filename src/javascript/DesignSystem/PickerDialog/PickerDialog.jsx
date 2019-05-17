import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import {Typography} from '@jahia/ds-mui-theme';

import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import {NodeTrees, ProgressOverlay} from '@jahia/react-material';

const styles = theme => ({
    drawerPaper: {
        width: '15vw',
        backgroundColor: theme.palette.ui.beta
    },
    modalContent: {
        width: '85vw',
        marginLeft: '15vw',
        padding: theme.spacing.unit
    },
    actions: {
        position: 'fixed',
        width: '85vw',
        backgroundColor: theme.palette.ui.epsilon,
        bottom: 0,
        padding: `0 ${theme.spacing.unit * 4}`,
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
    },
    listItem: {
        color: theme.palette.primary.contrastText
    }
});

const PickerDialogCmp = ({onCloseDialog, classes, idInput, t, site, lang, onItemSelection, loading, selectedPath, setSelectedPath, nodeTreeConfigs, children}) => {
    const [openPaths, setOpenPaths] = useState([]);
    const [selectedItem, setSelectedItem] = useState(false);

    return (
        <>{
            loading &&
            <section>
                <ProgressOverlay/>
            </section>
        }
            <Drawer
                open
                component="nav"
                variant="permanent"
                anchor="left"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <NodeTrees isOpen
                           path={selectedPath}
                           openPaths={openPaths}
                           siteKey={site}
                           lang={lang}
                           nodeTreeConfigs={nodeTreeConfigs}
                           classes={{
                               listItem: classes.listItem
                           }}
                           setPath={path => setSelectedPath(path)}
                           openPath={path => setOpenPaths(previousOpenPaths => previousOpenPaths.concat([path]))}
                           closePath={path => setOpenPaths(previousOpenPaths => previousOpenPaths.filter(item => item !== path))}
                           closeTree={() => console.log('close tree')}
                />
            </Drawer>

            <main className={classes.modalContent}>
                {children(setSelectedItem)}

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
                        <Button data-sel-media-picker-dialog-action="cancel"
                                type="button"
                                color="secondary"
                                onClick={onCloseDialog}
                        >
                            {t('content-editor:label.contentEditor.edit.fields.modalCancel')}
                        </Button>
                        <Button data-sel-media-picker-dialog-action="done"
                                disabled={!selectedItem}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => onItemSelection(selectedItem)}
                        >
                            {t('content-editor:label.contentEditor.edit.fields.modalDone')}
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
};

PickerDialogCmp.propTypes = {
    children: PropTypes.func.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedPath: PropTypes.string.isRequired,
    setSelectedPath: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    idInput: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const PickerDialog = compose(
    translate(),
    withStyles(styles)
)(PickerDialogCmp);

export {PickerDialog};
