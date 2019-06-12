import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import {Typography} from '@jahia/design-system-kit';

import {withStyles} from '@material-ui/core';
import {NodeTrees} from '@jahia/react-material';

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

const PickerDialogCmp = ({onCloseDialog, classes, idInput, site, lang, onItemSelection, nodeTreeConfigs, children, modalCancelLabel, modalDoneLabel}) => {
    // Use root path of the first tree config by default

    const [selectedPath, setSelectedPath] = useState('/sites/' + site + nodeTreeConfigs[0].rootPath);
    const [openPaths, setOpenPaths] = useState([]);
    const [selectedItem, setSelectedItem] = useState(false);

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
                {children(setSelectedItem, selectedPath)}

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
                        <Button data-sel-picker-dialog-action="cancel"
                                type="button"
                                color="secondary"
                                onClick={onCloseDialog}
                        >
                            {modalCancelLabel}
                        </Button>
                        <Button data-sel-picker-dialog-action="done"
                                disabled={!selectedItem}
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => onItemSelection(selectedItem)}
                        >
                            {modalDoneLabel}
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
    lang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    idInput: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    modalCancelLabel: PropTypes.string.isRequired,
    modalDoneLabel: PropTypes.string.isRequired
};

const PickerDialog = withStyles(styles)(PickerDialogCmp);

export {PickerDialog};
