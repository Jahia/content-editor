import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import {NodeTrees, PickerTreeViewMaterial} from '@jahia/react-material';
import {Picker} from '@jahia/data-helper';

import {withStyles} from '@material-ui/core';

import {getDetailedPathArray, getSite} from '../Picker.utils';
import SiteSwitcher from '~/DesignSystem/SiteSwitcher';

const styles = theme => ({
    drawerPaper: {
        width: '15vw',
        backgroundColor: theme.palette.ui.beta
    },
    listItem: {
        color: theme.palette.primary.contrastText
    }
});

const LeftPanelCmp = ({
    site,
    siteNodes,
    field,
    lang,
    initialSelectedItem,
    nodeTreeConfigs,
    onSelectSite,
    selectedPath,
    setSelectedPath,
    setSelectedItem,
    classes
}) => {
    const selectedItemSite = getSite(initialSelectedItem);
    const initialPathOpenPath = getDetailedPathArray(initialSelectedItem, selectedItemSite);
    const [openPaths, setOpenPaths] = useState(initialPathOpenPath);
    const showSiteSwitcher = !(field.selectorOptions && field.selectorOptions.find(option => option.value === 'site'));

    const openPath = path => {
        setOpenPaths(previousOpenPaths => previousOpenPaths.concat([path]));
    };

    const closePath = path => {
        setOpenPaths(previousOpenPaths => previousOpenPaths.filter(item => item !== path));
    };

    return (
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
                onSelectSite={(e, siteName) => {
                    const siteNode = siteNodes.find(siteItem => siteItem.name === siteName.value);
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
                            queryVariables={{language: lang}}
                            selectedPaths={[path]}
                            openSelection={false}
                            setRefetch={setRefetch}
                            onOpenItem={(path, open) => (open ? openPath(path) : closePath(path))}
                            onSelectItem={itemSite => {
                                setSelectedItem(undefined);
                                setSelectedPath(itemSite);
                            }}
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
    );
};

LeftPanelCmp.propTypes = {
    site: PropTypes.string.isRequired,
    siteNodes: PropTypes.array.isRequired,
    field: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    initialSelectedItem: PropTypes.string,
    nodeTreeConfigs: PropTypes.array.isRequired,
    selectedPath: PropTypes.string,
    setSelectedPath: PropTypes.func.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    onSelectSite: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export const LeftPanel = withStyles(styles)(LeftPanelCmp);
LeftPanel.displayName = 'LeftPanel';
