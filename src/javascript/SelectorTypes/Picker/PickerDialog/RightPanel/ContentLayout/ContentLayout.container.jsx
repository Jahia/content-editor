import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Loader} from '@jahia/moonstone';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import ContentTable from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentTable';
import {registry} from '@jahia/ui-extender';
import {useLayoutQuery} from '@jahia/jcontent';
import {cePickerSetTableViewType} from '~/SelectorTypes/Picker/Picker2.redux';

let currentResult;

const setRefetcher = (name, refetcherData) => {
    registry.addOrReplace('refetcher', name, refetcherData);
};

const unsetRefetcher = name => {
    delete registry.registry['refetcher-' + name];
};

export const ContentLayoutContainer = ({pickerConfig}) => {
    const {t} = useTranslation();
    const {mode, path, filesMode, tableView, preSearchModeMemo, searchTerms, searchPath} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        filesMode: 'grid',
        tableView: state.contenteditor.picker.tableView,
        preSearchModeMemo: state.contenteditor.picker.preSearchModeMemo,
        searchTerms: state.contenteditor.picker.searchTerms,
        searchPath: state.contenteditor.picker.searchPath
    }), shallowEqual);
    const dispatch = useDispatch();
    const canSelectPages = pickerConfig.selectableTypesTable.includes('jnt:page');
    const openableTypes = registry.get('accordionItem', mode)?.config?.openableTypes;

    const additionalFragments = [];
    if (mode === Constants.mode.SEARCH && preSearchModeMemo) {
        additionalFragments.push(...registry.get('accordionItem', preSearchModeMemo)?.queryHandler?.getFragments());
    }

    const {layoutQuery, layoutQueryParams, result, error, loading, isStructured, refetch} = useLayoutQuery(state => ({
        mode: state.contenteditor.picker.mode,
        siteKey: state.site,
        params: {
            searchTerms,
            searchPath,
            searchContentType: pickerConfig.searchSelectorType,
            selectableTypesTable: pickerConfig.selectableTypesTable,
            openableTypes
        },
        path: state.contenteditor.picker.path,
        lang: state.contenteditor.ceLanguage,
        uilang: state.uilang,
        filesMode: 'grid',
        pagination: state.contenteditor.picker.pagination,
        sort: state.contenteditor.picker.sort,
        tableView: state.contenteditor.picker.tableView
    }), {}, additionalFragments);

    // Reset table view type to content if pages cannot be picked, we do not show table view selector if pages cannot
    // be picked
    useEffect(() => {
        if (!canSelectPages && tableView.viewType === Constants.tableView.type.PAGES) {
            dispatch(cePickerSetTableViewType(Constants.tableView.type.CONTENT));
        }
    }, [dispatch, canSelectPages, tableView.viewType]);

    useEffect(() => {
        setRefetcher('pickerData', {
            query: layoutQuery,
            queryParams: layoutQueryParams,
            refetch: refetch
        });

        return () => {
            unsetRefetcher('pickerData');
        };
    });
    if (error || (!loading && !result)) {
        if (error) {
            const message = t('jcontent:label.contentManager.error.queryingContent', {details: error.message || ''});
            console.error(message);
        }

        return (
            <ContentTable isContentNotFound
                          pickerConfig={pickerConfig}
                          canSelectPages={canSelectPages}
                          path={path}
                          filesMode={filesMode}
                          rows={[]}
                          isStructured={isStructured}
                          isLoading={loading}
                          totalCount={0}
            />
        );
    }

    if (loading) {
        // While loading new results, render current ones loaded during previous render invocation (if any).
    } else {
        currentResult = result;
    }

    let rows = [];
    let totalCount = 0;

    if (currentResult) {
        totalCount = currentResult.pageInfo.totalCount;
        rows = currentResult.nodes;
    }

    return (
        <>
            {loading && (
                <div className="flexFluid flexCol_center alignCenter" style={{flex: '9999', backgroundColor: 'var(--color-light)'}}>
                    <Loader size="big"/>
                </div>
            )}
            <ContentTable pickerConfig={pickerConfig}
                          canSelectPages={canSelectPages}
                          path={path}
                          filesMode={filesMode}
                          rows={rows}
                          isStructured={isStructured}
                          isLoading={loading}
                          totalCount={totalCount}
            />
        </>
    );
};

ContentLayoutContainer.propTypes = {
    pickerConfig: configPropType.isRequired
};

export default ContentLayoutContainer;
