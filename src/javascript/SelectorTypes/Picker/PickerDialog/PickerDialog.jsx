import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Dialog, Slide} from '@material-ui/core';

import {LeftPanel} from './LeftPanel';
import {MainPanel} from './MainPanel';

import {useQuery} from '@apollo/react-hooks';
import {SiteNodesQuery} from './PickerDialog.gql-queries';
import {getPathWithoutFile, getSite, getSiteNodes} from './Picker.utils';
import {useDebounce} from './useDebounce';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import styles from './PickerDialog.scss';
import {useTranslation} from 'react-i18next';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const getNodeTreeConfigs = (pickerConfig, site, siteName, t) => {
    return pickerConfig.treeConfigs.map(treeConfig => {
        return {
            ...treeConfig,
            rootPath: treeConfig.getRootPath && treeConfig.getRootPath(site),
            rootLabel: t(treeConfig.rootLabelKey, {
                siteName: siteName
            }),
            key: `browse-tree-${treeConfig.type}`
        };
    });
};

const useSiteSwitcher = ({initialSelectedItem, lang, site, nodeTreeConfigs, t}) => {
    const {data, error, loading} = useQuery(SiteNodesQuery, {
        variables: {
            query: 'select * from [jnt:virtualsite] where ischildnode(\'/sites\')',
            displayLanguage: lang
        }
    });

    const selectedSite = initialSelectedItem ? getSite(initialSelectedItem).slice(7) : site;
    const [currentSite, setSite] = useState(selectedSite);

    if (error || loading) {
        return {error, loading};
    }

    const siteNodes = getSiteNodes(data, t('content-editor:label.contentEditor.siteSwitcher.allSites'));
    const siteNode = siteNodes.find(siteNode => siteNode.name === currentSite);

    const onSelectSite = siteNode => {
        setSite(siteNode.name);
        return siteNode.allSites ? '/sites' : nodeTreeConfigs[0].getRootPath(siteNode.name);
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

export const PickerDialog = ({
    isOpen,
    onClose,
    initialSelectedItem,
    field,
    editorContext,
    pickerConfig,
    onItemSelection
}) => {
    const {lang, uilang, site, siteInfo} = editorContext;
    const {t} = useTranslation();

    const nodeTreeConfigs = getNodeTreeConfigs(pickerConfig, site, siteInfo.displayName, t);

    const {
        currentSite,
        selectedSite,
        setSite,
        siteNodes,
        siteNode,
        error,
        loading,
        onSelectSite
    } = useSiteSwitcher({initialSelectedItem, site, lang, nodeTreeConfigs, t});

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
            selectableTypes: siteNode && siteNode.allSites ? [...nodeTreeConfig.selectableTypes, 'jnt:virtualsitesFolder'] : nodeTreeConfig.selectableTypes,
            openableTypes: siteNode && siteNode.allSites ? [...nodeTreeConfig.openableTypes, 'jnt:virtualsitesFolder', 'jnt:virtualsite'] : nodeTreeConfig.openableTypes,
            rootPath: siteNode && siteNode.allSites ? '/sites' : nodeTreeConfig.getRootPath(currentSite),
            rootLabel: siteNode && siteNode.displayName
        }));

    return (
        <Dialog
            fullScreen
            classes={{root: styles.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={() => {
                onClose();
                setSite(selectedSite);
            }}
            onExited={() => {
                setSelectedPath(initialPath || nodeTreeConfigs[0].rootPath);
                handleSearchChange({target: {value: ''}});
            }}
        >
            {isOpen && (
                <>
                    {pickerConfig.pickerDialog.displayTree !== false && (
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
                        className={styles.modalContent + (pickerConfig.pickerDialog.displayTree !== false ? ` ${styles.modalContentWithDrawer}` : '')}
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
                            onItemSelection={onItemSelection}
                            onCloseDialog={onClose}
                        />
                    </div>
                </>
            )}
        </Dialog>
    );
};

PickerDialog.defaultProps = {
    initialSelectedItem: null
};

PickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelectedItem: PropTypes.string,
    onItemSelection: PropTypes.func.isRequired
};
