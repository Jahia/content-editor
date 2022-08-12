import React from 'react';
import {Dropdown, SearchContextInput, SiteWeb} from '@jahia/moonstone';
import styles from './Search.scss';
import {cePickerSetSearchPath, cePickerSetSearchTerm} from '~/SelectorTypes/Picker/Picker2.redux';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {registry} from '@jahia/ui-extender';
import {NodeIcon} from '@jahia/jcontent';
import {useQuery} from '@apollo/react-hooks';
import {GET_PICKER_NODE} from '~/SelectorTypes/Picker';
import {batchActions} from 'redux-batched-actions';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';

export const Search = () => {
    const {t} = useTranslation('content-editor');
    const dispatch = useDispatch();
    const {searchTerms, searchPath, preSearchModeMemo, currentPath, currentSite, language, uilang, mode} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        searchTerms: state.contenteditor.picker.searchTerms,
        searchPath: state.contenteditor.picker.searchPath,
        preSearchModeMemo: state.contenteditor.picker.preSearchModeMemo,
        currentPath: state.contenteditor.picker.path,
        currentSite: state.contenteditor.picker.site,
        language: state.language,
        uilang: state.uilang
    }), shallowEqual);

    const {data} = useQuery(GET_PICKER_NODE, {
        variables: {
            paths: [currentPath], lang: language, uilang
        }
    });

    const node = data && data.jcr.nodesByPath[0];

    const handleChangeContext = (e, item) => {
        dispatch(cePickerSetSearchPath(item.searchPath));
    };

    const previousMode = mode === Constants.mode.SEARCH ? preSearchModeMemo : mode;

    const handleChangeTerms = e => {
        if (e.target.value === '') {
            handleClearTerms();
        } else {
            dispatch(batchActions([
                cePickerSetSearchPath(searchPath === '' ? currentPath : searchPath),
                cePickerSetSearchTerm(e.target.value)
            ]));
        }
    };

    const handleClearTerms = () => {
        dispatch(batchActions([
            cePickerSetSearchTerm(''),
            cePickerSetSearchPath(currentPath)
        ]));
    };

    const accordion = registry.get('accordionItem', previousMode);

    const searchContextData = (
        [
            {
                label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.search'),
                searchPath: '',
                isDisabled: true
            },
            {
                label: currentSite.substring(0, 1).toUpperCase() + currentSite.substring(1),
                searchPath: `/sites/${currentSite}`,
                iconStart: <SiteWeb/>
            },
            {
                label: t(accordion.label),
                searchPath: accordion.defaultPath(currentSite),
                iconStart: accordion.icon
            },
            ...(accordion && accordion.getSearchContextData ? accordion.getSearchContextData(currentSite, node, t) : []),
            {
                label: node?.displayName,
                searchPath: currentPath,
                iconStart: <NodeIcon node={node}/>
            }
        ]
    ).filter((currentItem, index, array) => array.findIndex(item => item.searchPath === currentItem.searchPath) === index)
        .filter(value => currentPath.startsWith(value.searchPath));

    const currentSearchContext = searchContextData.find(value => value.searchPath === (searchPath === '' ? currentPath : searchPath));

    return (
        <SearchContextInput
            searchContext={<Dropdown data={searchContextData}
                                     value={currentSearchContext.searchPath}
                                     label={currentSearchContext.label}
                                     icon={currentSearchContext.iconStart}
                                     onChange={handleChangeContext}/>}
            size="big"
            value={searchTerms}
            className={styles.searchInput}
            onChange={e => handleChangeTerms(e)}
            onClear={e => handleClearTerms(e)}
        />
    );
};
