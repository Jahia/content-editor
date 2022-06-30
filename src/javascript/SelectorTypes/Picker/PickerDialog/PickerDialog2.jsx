import React, {useState, Suspense} from 'react';
import PropTypes from 'prop-types';

import {Dialog, Slide} from '@material-ui/core';
import {useQuery} from '@apollo/react-hooks';
import {SiteNodesQuery} from './PickerDialog.gql-queries';
import {getPathWithoutFile, getSite, getSiteNodes} from './Picker.utils';
import {useDebounce} from './useDebounce';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import styles from './PickerDialog.scss';
import {LayoutModule} from '@jahia/moonstone';
import {cePickerPath, cePickerSite, cePickerMode} from '~/SelectorTypes/Picker/Picker2.redux';
import {ACCORDION_ITEM_NAME, TARGETS} from '~/SelectorTypes/Picker/Picker2.accordionItems';
import {batchActions} from 'redux-batched-actions';

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

const ContentNavigation = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentNavigation})));

const SiteSwitcher = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.SiteSwitcher})));

const selectorObject = {
    mode: state => state.contenteditor.picker.mode,
    siteKey: state => state.contenteditor.picker.site,
    language: state => state.language
};

const switcherSelectorObject = {
    siteKey: state => state.contenteditor.picker.site,
    currentLang: state => state.language
};

export const PickerDialog = ({
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

    console.log(initialPath, pickerConfig, nodeTreeConfigs)
    return (
        <Dialog
            fullScreen
            classes={{root: styles.rootDialog}}
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
            <Suspense fallback={<div>Loading picker ...</div>}>
                <LayoutModule navigation={
                    pickerConfig.displayTree &&
                    <ContentNavigation header={<div><SiteSwitcher selectorObject={switcherSelectorObject} onSelectAction={siteNode => cePickerSite(siteNode.name)}/></div>}
                                       accordionItemType={ACCORDION_ITEM_NAME}
                                       accordionItemTarget={TARGETS.defaultPicker}
                                       sitePermissions={[]}
                                       selectorObject={selectorObject}
                                       handleNavigation={(mode, path) => (batchActions([cePickerPath(path), cePickerMode(mode)]))}
                    />}
                              content={<h1>Content</h1>}
                />
            </Suspense>
        </Dialog>
    );
};

PickerDialog.defaultProps = {
    initialSelectedItem: null
};

PickerDialog.propTypes = {
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
