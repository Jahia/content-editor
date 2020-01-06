import {Picker} from '@jahia/react-apollo';
import {buttonRenderer, DisplayActions, NodeTrees, PickerTreeViewMaterial} from '@jahia/react-material';
import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core';
import {getDetailedPathArray, getPathWithoutFile, getSite} from '../PickerDialog.utils';
import SiteSwitcher from '~/DesignSystem/SiteSwitcher/SiteSwitcher';

const styles = theme => ({
    drawerPaper: {
        width: '15vw',
        backgroundColor: theme.palette.ui.beta
    },
    modalContent: {
        padding: theme.spacing.unit
    },
    modalContentWithDrawer: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        marginLeft: '15vw'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${theme.spacing.unit * 4}`,
        backgroundColor: theme.palette.ui.epsilon
    },
    actionsJahiaAction: {
        '& svg': {
            color: theme.palette.font.gamma
        },
        '& button span[data-jahia-link]:hover': {
            textDecoration: 'underline'
        }
    },
    listItem: {
        color: theme.palette.primary.contrastText
    }
});

const PickerDialogCmp = ({
    onCloseDialog,
    classes,
    displayTree,
    initialSelectedItem,
    site,
    siteNodes,
    onSelectSite,
    showSiteSwitcher,
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
    // SelectedItem is an object when something is selected
    // undefined when never modified
    // empty array when no value is selected and something has been unselected
    const [selectedItem, setSelectedItem] = useState(undefined);

    const openPath = path => {
        setOpenPaths(previousOpenPaths => previousOpenPaths.concat([path]));
    };

    const closePath = path => {
        setOpenPaths(previousOpenPaths => previousOpenPaths.filter(item => item !== path));
    };

    const setPath = path => {
        setSelectedPath(path);
    };

    const selectElement = () => {
        if (selectedItem) {
            onItemSelection(selectedItem);
        } else {
            onCloseDialog();
        }
    };

    const isElementSelected = !(selectedItem && selectedItem.length !== 0);
    const initialItemHasChanged = initialSelectedItem && selectedItem === undefined;
    return (
        <>
            {displayTree &&
            <Drawer
                open
                component="nav"
                variant="permanent"
                anchor="left"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                {showSiteSwitcher &&
                <SiteSwitcher
                    id="site-switcher"
                    siteKey={site}
                    siteNodes={siteNodes}
                    onSelectSite={siteNode => {
                        const path = onSelectSite(siteNode);
                        setOpenPaths([path]);
                        setSelectedPath(path);
                    }}
                />}

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
            </Drawer>}

            <div className={classes.modalContent + (displayTree ? ` ${classes.modalContentWithDrawer}` : '')}>
                {children({
                    setSelectedItem,
                    selectedPath,
                    setSelectedPath,
                    initialSelection: initialSelectedItem ? [initialSelectedItem] : []
                })}

                <div className={classes.actions}>
                    <Button
                        data-sel-picker-dialog-action="cancel"
                        type="button"
                        variant="secondary"
                        onClick={onCloseDialog}
                    >
                        {modalCancelLabel}
                    </Button>
                    <div className={classes.actionsJahiaAction}>
                        <DisplayActions context={{path: selectedPath}}
                                        target="pickerDialogAction"
                                        render={({context}) => {
                                            const Button = buttonRenderer({variant: 'ghost'}, true);
                                            return <Button context={context}/>;
                                        }}
                        />
                    </div>
                    <Button
                        data-sel-picker-dialog-action="done"
                        disabled={!(!isElementSelected || initialItemHasChanged)}
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={selectElement}
                    >
                        {modalDoneLabel}
                    </Button>
                </div>
            </div>
        </>
    );
};

PickerDialogCmp.defaultProps = {
    displayTree: true,
    showSiteSwitcher: true,
    initialSelectedItem: null
};

PickerDialogCmp.propTypes = {
    children: PropTypes.func.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    siteNodes: PropTypes.array.isRequired,
    onSelectSite: PropTypes.func.isRequired,
    showSiteSwitcher: PropTypes.bool,
    onCloseDialog: PropTypes.func.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    modalCancelLabel: PropTypes.string.isRequired,
    modalDoneLabel: PropTypes.string.isRequired,
    displayTree: PropTypes.bool,
    initialSelectedItem: PropTypes.string
};

export const PickerDialog = withStyles(styles)(PickerDialogCmp);

PickerDialog.displayName = 'PickerDialog';
