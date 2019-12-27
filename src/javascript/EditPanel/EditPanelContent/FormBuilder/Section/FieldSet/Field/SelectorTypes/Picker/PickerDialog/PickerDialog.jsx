import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {PickerDialog as PickerDialogToRefactor} from '~/DesignSystem/PickerDialog';

import Slide from '@material-ui/core/Slide';
import {FastField} from 'formik';
import {withStyles} from '@material-ui/core';
import {useQuery} from 'react-apollo-hooks';
import {SiteNodesQuery} from './PickerDialog.gql-queries';
import {ProgressOverlay} from '@jahia/react-material';
import {getSiteNodes} from '../Picker.utils';
import {Typography} from '@jahia/design-system-kit';
import {SearchInput} from './Search/Search';
import {getSite} from '~/DesignSystem/PickerDialog/PickerDialog.utils';

const styles = theme => ({
    rootDialog: {
        margin: theme.spacing.unit * 8
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '10px'
    },
    modalMain: {
        height: '100%'
    },
    searchInput: {
        flexGrow: 0.6
    }
});

const Transition = props => {
    return <Slide direction="up" {...props}/>;
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
    const selectedSite = initialSelectedItem ? getSite(initialSelectedItem).slice(7) : editorContext.site;
    const [site, setSite] = useState(selectedSite);
    const [searchTerms, setSearchTerms] = useState('');
    const handleSearchChange = e => {
        setSearchTerms(e.target.value);
    };

    const {data, error, loading} = useQuery(SiteNodesQuery, {
        variables: {
            query: 'select * from [jnt:virtualsite] where ischildnode(\'/sites\')',
            displayLanguage: editorContext.lang
        }
    });

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

    // TODO BACKLOG-11925 make a hook about the site switcher
    const siteNodes = getSiteNodes(data, t('content-editor:label.contentEditor.siteSwitcher.allSites'));
    const siteNode = siteNodes.find(siteNode => siteNode.name === site);
    const showSiteSwitcher = !(field.selectorOptions && field.selectorOptions.find(option => option.value === 'site'));
    const onSelectSite = siteNode => {
        setSite(siteNode.name);
        return siteNode.allSites ? '/sites' : nodeTreeConfigs[0].treeConfig.rootPath(siteNode.name);
    };

    const PickerDialogContent = pickerConfig.picker.PickerDialog.DialogContent;

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
                setSearchTerms('');
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

                           const nodeTreeConfigsAdapted = nodeTreeConfigs
                               .map(nodeTreeConfig => ({
                                   ...nodeTreeConfig,
                                   selectableTypes: siteNode.allSites ? [...nodeTreeConfig.treeConfig.selectableTypes, 'jnt:virtualsitesFolder'] : nodeTreeConfig.treeConfig.selectableTypes,
                                   openableTypes: siteNode.allSites ? [...nodeTreeConfig.treeConfig.openableTypes, 'jnt:virtualsitesFolder', 'jnt:virtualsite'] : nodeTreeConfig.treeConfig.openableTypes,
                                   rootPath: siteNode.allSites ? '/sites' : nodeTreeConfig.treeConfig.rootPath(site),
                                   rootLabel: siteNode.displayName
                               }));

                           const isPickerTypeFiles = nodeTreeConfigs[0].type === 'files';

                           return (
                               <PickerDialogToRefactor
                                   displayTree={pickerConfig.displayTree}
                                   idInput={id}
                                   site={site}
                                   siteNodes={siteNodes}
                                   showSiteSwitcher={showSiteSwitcher}
                                   lang={editorContext.lang}
                                   initialSelectedItem={initialSelectedItem}
                                   nodeTreeConfigs={nodeTreeConfigsAdapted}
                                   modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                                   modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                                   onSelectSite={siteNode => onSelectSite(siteNode)}
                                   onCloseDialog={() => setIsOpen(false)}
                                   onItemSelection={onItemSelection}
                               >
                                   {(setSelectedItem, selectedPath, initialSelection) => {
                                   // Build table config from picker config
                                   const tableConfig = {
                                       typeFilter: pickerConfig.selectableTypesTable,
                                       recursionTypesFilter: ['nt:base'],
                                       showOnlyNodesWithTemplates: pickerConfig.showOnlyNodesWithTemplates
                                   };

                                   return (
                                       <>
                                           <header className={classes.modalHeader}>
                                               <Typography variant="delta" color="alpha">
                                                   {t(pickerConfig.picker.PickerDialog.dialogTitle(isPickerTypeFiles))}
                                               </Typography>
                                               <SearchInput
                                                   selectedPath={selectedPath}
                                                   placeholder={t(pickerConfig.picker.PickerDialog.searchPlaceholder())}
                                                   className={classes.searchInput}
                                                   language={editorContext.lang}
                                                   onChange={handleSearchChange}
                                               />
                                           </header>
                                           <main className={classes.modalMain}>
                                               <PickerDialogContent
                                                    // For all Picker
                                                       tableConfig={tableConfig}
                                                       setSelectedItem={setSelectedItem}
                                                       selectedPath={selectedPath}
                                                       initialSelection={initialSelection}
                                                       editorContext={editorContext}
                                                       searchTerms={searchTerms}

                                                    // For mediaPicker
                                                       onImageDoubleClick={onItemSelection}
                                               />
                                           </main>
                                       </>
                                   );
                               }}
                               </PickerDialogToRefactor>
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
