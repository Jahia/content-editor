import React from 'react';
import {Dropdown, SearchContextInput, SiteWeb} from '@jahia/moonstone';
import styles from './Search.scss';
import {cePickerSetSearchContext, cePickerSetSearchTerm} from '~/SelectorTypes/Picker/Picker2.redux';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {registry} from '@jahia/ui-extender';
import {NodeIcon} from '@jahia/jcontent';
import {useQuery} from '@apollo/react-hooks';
import {GET_PICKER_NODE} from '~/SelectorTypes/Picker';

export const Search = () => {
    const {t} = useTranslation('content-editor');
    const dispatch = useDispatch();
    const {searchTerm, searchContext, currentPath, currentSite, language, uilang, mode} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        searchTerm: state.contenteditor.picker.searchTerm,
        searchContext: state.contenteditor.picker.searchContext,
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
        console.log('Updating search context', item.value);
        dispatch(cePickerSetSearchContext(item.value));
    };

    const handleChangeTerms = e => {
        console.log('Updating search terms', e.target.value);
        dispatch(cePickerSetSearchTerm(e.target.value));
    };

    const handleClearTerms = e => {
        console.log('Clearing search terms', e.target.value);
        dispatch(cePickerSetSearchTerm(''));
        dispatch(cePickerSetSearchContext(currentPath));
    };

    const accordion = registry.get('accordionItem', mode);

    const searchContextData = (
        [
            {
                label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.search'),
                value: '',
                isDisabled: true
            },
            {
                label: currentSite.substring(0, 1).toUpperCase() + currentSite.substring(1),
                value: `/sites/${currentSite}`,
                iconStart: <SiteWeb/>
            },
            {
                label: t(accordion.label),
                value: accordion.defaultPath(currentSite),
                iconStart: accordion.icon
            },
            ...(accordion.getSearchContextData ? accordion.getSearchContextData(currentSite, node, t) : []),
            {
                label: node?.displayName,
                value: currentPath,
                iconStart: <NodeIcon node={node}/>
            }
        ]
    ).filter((currentItem, index, array) => array.findIndex(item => item.value === currentItem.value) === index)
        .filter(value => currentPath.startsWith(value.value));

    const getCurrentSearchContext = () => {
        return searchContextData.find(value => value.value === (searchContext === '' ? currentPath : searchContext));
    };

    return (
        <SearchContextInput
            searchContext={<Dropdown data={searchContextData}
                                     value={getCurrentSearchContext().value}
                                     label={getCurrentSearchContext().label}
                                     icon={getCurrentSearchContext().iconStart}
                                     onChange={handleChangeContext}/>}
            size="big"
            value={searchTerm}
            className={styles.searchInput}
            onChange={e => handleChangeTerms(e)}
            onClear={e => handleClearTerms(e)}
        />
    );
};

