import React from 'react';
import {Dropdown, SearchContextInput} from '@jahia/moonstone';
import styles from './Search.scss';
import {cePickerSetSearchPath, cePickerSetSearchTerm} from '~/SelectorTypes/Picker/Picker.redux';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {registry} from '@jahia/ui-extender';
import {useQuery} from '@apollo/react-hooks';
import {batchActions} from 'redux-batched-actions';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {getBaseSearchContextData} from '~/SelectorTypes/Picker/Picker.utils';
import {GET_SEARCH_CONTEXT} from '../PickerDialog.gql-queries';
import PropTypes from 'prop-types';
import {jcontentUtils} from '@jahia/jcontent';

export const Search = ({accordionItemProps}) => {
    const {t} = useTranslation('content-editor');
    const dispatch = useDispatch();
    const {searchTerms, searchPath, preSearchModeMemo, currentPath, currentSite, language, uilang, mode} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        searchTerms: state.contenteditor.picker.searchTerms,
        searchPath: state.contenteditor.picker.searchPath,
        preSearchModeMemo: state.contenteditor.picker.preSearchModeMemo,
        currentPath: state.contenteditor.picker.path,
        currentSite: state.contenteditor.picker.site ? state.contenteditor.picker.site : state.site,
        language: state.language,
        uilang: state.uilang
    }), shallowEqual);

    const {data} = useQuery(GET_SEARCH_CONTEXT, {
        variables: {
            paths: [currentPath], language: language, uilang
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

    const accordion = jcontentUtils.getAccordionItem(registry.get('accordionItem', previousMode), accordionItemProps);
    const getSearchContextData = accordion.getSearchContextData || getBaseSearchContextData;
    const searchContextData = getSearchContextData({t, currentSite, accordion, node, currentPath});

    const currentSearchContext = searchContextData.find(value => value.searchPath === (searchPath === '' ? currentPath : searchPath)) || searchContextData[0];

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

Search.propTypes = {
    accordionItemProps: PropTypes.object
};
