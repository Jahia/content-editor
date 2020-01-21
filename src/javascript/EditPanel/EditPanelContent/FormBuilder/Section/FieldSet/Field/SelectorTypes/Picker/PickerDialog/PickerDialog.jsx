import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {FastField} from 'formik';
import Slide from '@material-ui/core/Slide';
import {ProgressOverlay} from '@jahia/react-material';

import {LeftPanel} from './LeftPanel';
import {MainPanel} from './MainPanel';

import {withStyles} from '@material-ui/core';
import {useQuery} from 'react-apollo-hooks';
import {SiteNodesQuery} from './PickerDialog.gql-queries';
import {getSite, getSiteNodes, getPathWithoutFile} from '../Picker.utils';
import {useDebounce} from './useDebounce';

const styles = theme => ({
    rootDialog: {
        margin: theme.spacing.unit * 8
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

const useSelectedPath = ({initialSelectedItem, nodeTreeConfigs}) => {
    const initialPath = getPathWithoutFile(initialSelectedItem);
    const [selectedPath, setSelectedPath] = useState(initialPath || nodeTreeConfigs[0].rootPath);
    return [selectedPath, setSelectedPath];
};

const useSiteSwitcher = ({initialSelectedItem, editorContext, nodeTreeConfigs, t}) => {
    const {data, error, loading} = useQuery(SiteNodesQuery, {
        variables: {
            query: 'select * from [jnt:virtualsite] where ischildnode(\'/sites\')',
            displayLanguage: editorContext.lang
        }
    });

    const selectedSite = initialSelectedItem ? getSite(initialSelectedItem).slice(7) : editorContext.site;
    const [site, setSite] = useState(selectedSite);

    if (error || loading) {
        return {error, loading};
    }

    const siteNodes = getSiteNodes(data, t('content-editor:label.contentEditor.siteSwitcher.allSites'));
    const siteNode = siteNodes.find(siteNode => siteNode.name === site);

    const onSelectSite = siteNode => {
        setSite(siteNode.name);
        return siteNode.allSites ? '/sites' : nodeTreeConfigs[0].treeConfig.rootPath(siteNode.name);
    };

    return {siteNode, siteNodes, site, onSelectSite, setSite, selectedSite};
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
    editorContext,
    id,
    field,
    nodeTreeConfigs,
    t,
    pickerConfig
}) => {
    const {
        site,
        selectedSite,
        setSite,
        siteNodes,
        siteNode,
        error,
        loading,
        onSelectSite
    } = useSiteSwitcher({initialSelectedItem, editorContext, nodeTreeConfigs, t});

    // SelectedItem is an object when something is selected
    // undefined when never modified
    // empty array when no value is selected and something has been unselected
    const [selectedItem, setSelectedItem] = useState(undefined);

    const [selectedPath, setSelectedPath] = useSelectedPath({initialSelectedItem, nodeTreeConfigs});
    const [searchTerms, handleSearchChange] = useSearch();

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const nodeTreeConfigsAdapted = nodeTreeConfigs
        .map(nodeTreeConfig => ({
            ...nodeTreeConfig,
            selectableTypes: siteNode && siteNode.allSites ? [...nodeTreeConfig.treeConfig.selectableTypes, 'jnt:virtualsitesFolder'] : nodeTreeConfig.treeConfig.selectableTypes,
            openableTypes: siteNode && siteNode.allSites ? [...nodeTreeConfig.treeConfig.openableTypes, 'jnt:virtualsitesFolder', 'jnt:virtualsite'] : nodeTreeConfig.treeConfig.openableTypes,
            rootPath: siteNode && siteNode.allSites ? '/sites' : nodeTreeConfig.treeConfig.rootPath(site),
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
                handleSearchChange({target: {value: ''}});
            }}
        >
            <FastField shouldUpdate={() => true}
                       render={({form: {setFieldValue, setFieldTouched}}) => {
                           const onItemSelection = data => {
                               setFieldValue(
                                   id,
                                   pickerConfig.picker.PickerDialog.itemSelectionAdapter(data),
                                   true
                               );
                               setIsOpen(false);
                               setFieldTouched(field.name, field.multiple ? [true] : true);
                           };

                           return (
                               <>
                                   {pickerConfig.displayTree && (
                                   <LeftPanel
                                        site={site}
                                        siteNodes={siteNodes}
                                        selectedPath={selectedPath}
                                        setSelectedPath={setSelectedPath}
                                        setSelectedItem={setSelectedItem}
                                        field={field}
                                        initialSelectedItem={initialSelectedItem}
                                        lang={editorContext.lang}
                                        nodeTreeConfigs={nodeTreeConfigsAdapted}
                                        onSelectSite={onSelectSite}
                                   />)}
                                   <div className={classes.modalContent + (pickerConfig.displayTree ? ` ${classes.modalContentWithDrawer}` : '')}>
                                       <MainPanel
                                            setSelectedPath={setSelectedPath}
                                            pickerConfig={pickerConfig}
                                            nodeTreeConfigs={nodeTreeConfigsAdapted}
                                            initialSelectedItem={initialSelectedItem}
                                            selectedItem={selectedItem}
                                            setSelectedItem={setSelectedItem}
                                            selectedPath={selectedPath}
                                            editorContext={editorContext}
                                            searchTerms={searchTerms}
                                            handleSearchChange={handleSearchChange}
                                            t={t}
                                            onItemSelection={onItemSelection}
                                            onCloseDialog={() => setIsOpen(false)}
                                       />
                                   </div>
                               </>
                           );
                   }}
            />
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
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    initialSelectedItem: PropTypes.string
};

export const PickerDialog = withStyles(styles)(PickerDialogCmp);
PickerDialog.displayName = 'PickerDialog';
