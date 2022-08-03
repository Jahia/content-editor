import React, {useEffect, useMemo} from 'react';
import {useApolloClient, useQuery} from 'react-apollo';
import {contentQueryHandlerByMode} from './ContentLayout.gql-queries';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import usePreloadedData from './usePreloadedData';
import {Loader} from '@jahia/moonstone';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import ContentTable from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentTable';
import {
    resolveQueryConstraints, structureData
} from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentLayout.utils';
import {registry} from '@jahia/ui-extender';
import {cePickerSetTableViewType} from '~/SelectorTypes/Picker/Picker2.redux';

const selector = state => ({
    mode: state.contenteditor.picker.mode.replace('picker-', ''),
    path: state.contenteditor.picker.path,
    lang: state.language,
    uilang: state.uilang,
    filesMode: 'grid',
    pagination: state.contenteditor.picker.pagination,
    sort: state.contenteditor.picker.sort,
    tableView: state.contenteditor.picker.tableView
});

let currentResult;

const setRefetcher = (name, refetcherData) => {
    registry.addOrReplace('refetcher', name, refetcherData);
};

const unsetRefetcher = name => {
    delete registry.registry['refetcher-' + name];
};

export const ContentLayoutContainer = ({pickerConfig}) => {
    const {t} = useTranslation();
    const {
        mode,
        path,
        lang,
        uilang,
        filesMode,
        pagination,
        sort,
        tableView
    } = useSelector(selector, shallowEqual);
    const dispatch = useDispatch();
    const client = useApolloClient();
    const fetchPolicy = 'network-only';
    const isStructuredView = tableView.viewMode === Constants.tableView.mode.STRUCTURED;
    const params = useMemo(() => resolveQueryConstraints(pickerConfig, mode), [mode, pickerConfig]);
    const queryHandler = useMemo(() => contentQueryHandlerByMode(mode), [mode]);
    const layoutQuery = queryHandler.getQuery();
    const canSelectPages = pickerConfig.selectableTypesTable.includes('jnt:page');
    const preloadForTableViewType = tableView.viewType === Constants.tableView.type.PAGES || !canSelectPages ? Constants.tableView.type.CONTENT : Constants.tableView.type.PAGES;

    // Reset table view type to content if pages cannot be picked, we do not show table view selector if pages cannot
    // be picked
    useEffect(() => {
        if (!canSelectPages && tableView.viewType === Constants.tableView.type.PAGES) {
            dispatch(cePickerSetTableViewType(Constants.tableView.type.CONTENT));
        }
    }, [dispatch, canSelectPages, tableView.viewType]);

    const layoutQueryParams = useMemo(
        () => {
            let r = queryHandler.getQueryParams({path, uilang, lang, params, pagination, sort, viewType: tableView.viewType});
            // Update params for structured view to use different type and recursion filters
            if (isStructuredView && tableView.viewType === Constants.tableView.type.CONTENT) {
                r = queryHandler.updateQueryParamsForStructuredView(r, tableView.viewType, mode);
            }

            return r;
        },
        [path, uilang, lang, pagination, sort, tableView.viewType, mode, isStructuredView, queryHandler, params]
    );

    const {data, error, loading, refetch} = useQuery(layoutQuery, {
        variables: layoutQueryParams,
        fetchPolicy: fetchPolicy
    });

    const options = useMemo(() => ({
        query: layoutQuery,
        variables: (isStructuredView && tableView.viewType !== Constants.tableView.type.CONTENT) ?
            queryHandler.updateQueryParamsForStructuredView(layoutQueryParams, preloadForTableViewType, mode) :
            queryHandler.getQueryParams({path, uilang, lang, params, pagination: {...pagination, currentPage: 0}, sort, viewType: preloadForTableViewType}),
        fetchPolicy: fetchPolicy
    }), [isStructuredView, lang, layoutQuery, layoutQueryParams, mode, pagination, path, preloadForTableViewType, queryHandler, sort, uilang, params]);

    // Preload data either for pages or contents depending on current view type
    const preloadedData = usePreloadedData({
        client,
        options,
        tableView,
        path,
        pagination
    });

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
    if (error || (!loading && !queryHandler.getResultsPath(data))) {
        if (error) {
            const message = t('jcontent:label.contentManager.error.queryingContent', {details: error.message || ''});
            console.error(message);
        }

        return (
            <ContentTable isContentNotFound
                          path={path}
                          filesMode={filesMode}
                          rows={[]}
                          isLoading={loading}
                          totalCount={0}
            />
        );
    }

    if (loading) {
        // While loading new results, render current ones loaded during previous render invocation (if any).
    } else {
        currentResult = queryHandler.getResultsPath(data);
    }

    let rows = [];
    let totalCount = 0;

    if (currentResult) {
        totalCount = currentResult.pageInfo.totalCount;
        if (isStructuredView && mode !== Constants.mode.SEARCH) {
            rows = structureData(path, currentResult.nodes);
        } else {
            rows = currentResult.nodes;
        }
    }

    return (
        <React.Fragment>
            {loading && (
                <div className="flexFluid flexCol_center alignCenter" style={{flex: '9999', backgroundColor: 'var(--color-light)'}}>
                    <Loader size="big"/>
                </div>
            )}
            <ContentTable path={path}
                          filesMode={filesMode}
                          rows={rows}
                          isLoading={loading}
                          totalCount={totalCount}
                          dataCounts={canSelectPages ? ({
                              pages: preloadForTableViewType === Constants.tableView.type.PAGES ? preloadedData.totalCount : totalCount,
                              contents: preloadForTableViewType === Constants.tableView.type.CONTENT ? preloadedData.totalCount : totalCount
                          }) : undefined}
            />
        </React.Fragment>
    );
};

ContentLayoutContainer.propTypes = {
    pickerConfig: configPropType.isRequired
};

export default ContentLayoutContainer;
