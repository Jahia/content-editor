import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import Slide from '@material-ui/core/Slide';

import {LeftPanel} from './LeftPanel';
import {MainPanel} from './MainPanel';

import {withStyles} from '@material-ui/core';
import {useQuery} from '@apollo/react-hooks';
import {SiteNodesQuery} from './PickerDialog.gql-queries';
import {getPathWithoutFile, getSite, getSiteNodes} from '../Picker.utils';
import {useDebounce} from './useDebounce';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

const styles = theme => ({
    rootDialog: {
        margin: theme.spacing.unit * 8,
        zIndex: 10011 // IMPORTANT: DO NOT REMOVE: CKEditor image picker is using 10010, and we need to display this on top of CKEditor interfaces
    },
    modalContent: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        padding: theme.spacing.unit
    },
    modalContentWithDrawer: {
        marginLeft: '15vw'
    }
});

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const useSiteSwitcher = ({initialSelectedItem, lang, siteKey, nodeTreeConfigs, t}) => {
    const {data, error, loading} = useQuery(SiteNodesQuery, {
        variables: {
            query: 'select * from [jnt:virtualsite] where ischildnode(\'/sites\')',
            displayLanguage: lang
        }
    });

    const selectedSite = initialSelectedItem ? getSite(initialSelectedItem).slice(7) : siteKey;
    const [currentSite, setSite] = useState(selectedSite);

    if (error || loading) {
        return {error, loading};
    }

    const siteNodes = getSiteNodes(data, t('content-editor:label.contentEditor.siteSwitcher.allSites'));
    const siteNode = siteNodes.find(siteNode => siteNode.name === currentSite);

    const onSelectSite = siteNode => {
        setSite(siteNode.name);
        return siteNode.allSites ? '/sites' : nodeTreeConfigs[0].treeConfig.rootPath(siteNode.name);
    };

    return {siteNode, siteNodes, currentSite, onSelectSite, setSite, selectedSite};
};

const useSearch = () => {
    const [searchTermsNotDebounced, setSearchTerms] = useState('');
    const handleSearchChange = e => {
        setSearchTerms(e.target.value);
    };

    const searchTerms = useDebounce(searchTermsNotDebounced, 300);

    return [searchTerms, handleSearchChange];
};

const PickerDialogCmp = ({
    classes,
    isOpen,
    setIsOpen,
    initialSelectedItem,
    siteKey,
    uilang,
    lang,
    field,
    nodeTreeConfigs,
    t,
    pickerConfig,
    onItemSelection
}) => {
    const {
        currentSite,
        selectedSite,
        setSite,
        siteNodes,
        siteNode,
        error,
        loading,
        onSelectSite
    } = useSiteSwitcher({initialSelectedItem, siteKey, lang, nodeTreeConfigs, t});

    // SelectedItem is an object when something is selected
    // undefined when never modified
    // empty array when no value is selected and something has been unselected
    const [selectedItem, setSelectedItem] = useState(undefined);

    const initialPath = getPathWithoutFile(initialSelectedItem);
    const [selectedPath, setSelectedPath] = useState(initialPath || nodeTreeConfigs[0].rootPath);
    const [searchTerms, handleSearchChange] = useSearch();

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    const nodeTreeConfigsAdapted = nodeTreeConfigs
        .map(nodeTreeConfig => ({
            ...nodeTreeConfig,
            selectableTypes: siteNode && siteNode.allSites ? [...nodeTreeConfig.treeConfig.selectableTypes, 'jnt:virtualsitesFolder'] : nodeTreeConfig.treeConfig.selectableTypes,
            openableTypes: siteNode && siteNode.allSites ? [...nodeTreeConfig.treeConfig.openableTypes, 'jnt:virtualsitesFolder', 'jnt:virtualsite'] : nodeTreeConfig.treeConfig.openableTypes,
            rootPath: siteNode && siteNode.allSites ? '/sites' : nodeTreeConfig.treeConfig.rootPath(currentSite),
            rootLabel: siteNode && siteNode.displayName
        }));

    return (
        <Dialog
            fullScreen
            classes={{root: classes.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={() => {
                setIsOpen(false);
                setSite(selectedSite);
            }}
            onExited={() => {
                setSelectedPath(initialPath || nodeTreeConfigs[0].rootPath);
                handleSearchChange({target: {value: ''}});
            }}
        >
            {isOpen && (
                <>
                    {pickerConfig.displayTree && (
                        <LeftPanel
                            site={currentSite}
                            siteNodes={siteNodes}
                            selectedPath={selectedPath}
                            setSelectedPath={setSelectedPath}
                            setSelectedItem={setSelectedItem}
                            field={field}
                            initialSelectedItem={initialSelectedItem}
                            lang={lang}
                            nodeTreeConfigs={nodeTreeConfigsAdapted}
                            onSelectSite={onSelectSite}
                        />)}
                    <div
                        className={classes.modalContent + (pickerConfig.displayTree ? ` ${classes.modalContentWithDrawer}` : '')}
                    >
                        <MainPanel
                            setSelectedPath={setSelectedPath}
                            pickerConfig={pickerConfig}
                            nodeTreeConfigs={nodeTreeConfigsAdapted}
                            initialSelectedItem={initialSelectedItem}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                            selectedPath={selectedPath}
                            lang={lang}
                            uilang={uilang}
                            searchTerms={searchTerms}
                            handleSearchChange={handleSearchChange}
                            t={t}
                            onItemSelection={onItemSelection}
                            onCloseDialog={() => setIsOpen(false)}
                        />
                    </div>
                </>
            )}
        </Dialog>
    );
};

PickerDialogCmp.defaultProps = {
    initialSelectedItem: null
};

PickerDialogCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    siteKey: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    initialSelectedItem: PropTypes.string,
    onItemSelection: PropTypes.func.isRequired
};

export const PickerDialog = withStyles(styles)(PickerDialogCmp);
PickerDialog.displayName = 'PickerDialog';
