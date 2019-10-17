import {Picker} from '@jahia/react-apollo';
import {PickerTreeViewMaterial} from '@jahia/react-material';
import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import {Typography} from '@jahia/design-system-kit';

import {withStyles} from '@material-ui/core';
import {NodeTrees} from '@jahia/react-material';
import {getPathWithoutFile, getSite, getDetailedPathArray} from './PickerDialog.utils';

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
        justifyContent: 'flex-end'
    },
    actionButtons: {
        '& button': {
            marginRight: theme.spacing.unit * 2
        }
    },
    actionUpload: {
        // TODO: update display of action upload
        // ticket: https://jira.jahia.org/browse/BACKLOG-10624
        display: 'none',
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

const PickerDialogCmp = ({
    onCloseDialog,
    classes,
    idInput,
    initialSelectedItem,
    site,
    lang,
    onItemSelection,
    nodeTreeConfigs,
    children,
    modalCancelLabel,
    modalDoneLabel
}) => {
    const initialPath = getPathWithoutFile(initialSelectedItem);
    const selectedItemSite = getSite(initialSelectedItem);
    const initialPathOpenPath = getDetailedPathArray(initialSelectedItem, selectedItemSite);

    const [selectedPath, setSelectedPath] = useState(initialPath || nodeTreeConfigs[0].rootPath);
    const [openPaths, setOpenPaths] = useState(initialPathOpenPath);
    const [selectedItem, setSelectedItem] = useState(false);

    const openPath = path => {
        setOpenPaths(previousOpenPaths => previousOpenPaths.concat([path]));
    };

    const closePath = path => {
        setOpenPaths(previousOpenPaths => previousOpenPaths.filter(item => item !== path));
    };

    const setPath = path => {
        setSelectedPath(path);
    };

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
                <NodeTrees path={selectedPath}
                           rootPath="/"
                           siteKey={site}
                           nodeTreeConfigs={nodeTreeConfigs}
                >
                    {({path, rootPath, openableTypes, selectableTypes, rootLabel, setRefetch, dataCmRole}) => (
                        <Picker rootPaths={[rootPath]}
                                openPaths={openPaths}
                                openableTypes={openableTypes}
                                selectableTypes={selectableTypes}
                                queryVariables={{lang: lang}}
                                selectedPaths={[path]}
                                openSelection={false}
                                setRefetch={setRefetch}
                                onOpenItem={(path, open) => (open ? openPath(path) : closePath(path))}
                                onSelectItem={path => setPath(path, {sub: false})}
                        >
                            {({handleSelect, ...others}) => (
                                <PickerTreeViewMaterial {...others}
                                                        dataCmRole={dataCmRole}
                                                        rootLabel={rootLabel}
                                                        classes={{listItem: classes.listItem}}
                                />
                            )}
                        </Picker>
                    )}
                </NodeTrees>
            </Drawer>

            <main className={classes.modalContent}>
                {children(setSelectedItem, selectedPath, initialSelectedItem ? [initialSelectedItem] : [])}

                <div className={classes.actions}>
                    <div className={classes.actionUpload}>
                        <CloudUpload/>
                        <Typography>
                            drag and drop your files here, or
                        </Typography>
                        <label>
                            <Typography>Browse your computer</Typography>
                            <input type="file" id={idInput}/>
                        </label>
                    </div>
                    <div className={classes.actionButtons}>
                        <Button
                            data-sel-picker-dialog-action="cancel"
                            type="button"
                            color="secondary"
                            onClick={onCloseDialog}
                        >
                            {modalCancelLabel}
                        </Button>
                        <Button
                            data-sel-picker-dialog-action="done"
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

PickerDialogCmp.defaultProps = {
    initialSelectedItem: null
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
    modalDoneLabel: PropTypes.string.isRequired,
    initialSelectedItem: PropTypes.string
};

export const PickerDialog = withStyles(styles)(PickerDialogCmp);

PickerDialog.displayName = 'PickerDialog';
