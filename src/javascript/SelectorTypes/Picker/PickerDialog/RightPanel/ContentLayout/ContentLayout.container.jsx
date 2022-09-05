import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Loader} from '@jahia/moonstone';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import ContentTable from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentTable';
import {registry} from '@jahia/ui-extender';
import {useLayoutQuery} from '@jahia/jcontent';
import clsx from 'clsx';
import styles from './ContentLayout.scss';
import {cePickerOpenPaths} from '~/SelectorTypes/Picker/Picker2.redux';

const setRefetcher = (name, refetcherData) => {
    registry.addOrReplace('refetcher', name, refetcherData);
};

const unsetRefetcher = name => {
    delete registry.registry['refetcher-' + name];
};

export const ContentLayoutContainer = ({pickerConfig}) => {
    const {t} = useTranslation();
    const currentResult = useRef();
    const {mode, path, filesMode, preSearchModeMemo, viewType, searchTerms, searchPath} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        filesMode: 'grid',
        tableView: state.contenteditor.picker.tableView,
        preSearchModeMemo: state.contenteditor.picker.preSearchModeMemo,
        viewType: state.contenteditor.picker.tableView.viewType,
        searchTerms: state.contenteditor.picker.searchTerms,
        searchPath: state.contenteditor.picker.searchPath
    }), shallowEqual);

    const dispatch = useDispatch();

    const openableTypes = registry.get('accordionItem', mode)?.config?.openableTypes;

    const additionalFragments = [];
    if (mode === Constants.mode.SEARCH && preSearchModeMemo) {
        additionalFragments.push(...registry.get('accordionItem', preSearchModeMemo)?.queryHandler?.getFragments());
    }

    const {result, error, loading, isStructured, refetch} = useLayoutQuery(state => ({
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
        tableView: state.contenteditor.picker.tableView,
        openPaths: state.contenteditor.picker.openPaths
    }), {}, additionalFragments);

    useEffect(() => {
        setRefetcher('pickerData', {
            refetch: refetch
        });

        return () => {
            unsetRefetcher('pickerData');
        };
    });

    const autoExpand = useRef({path: '', level: 1, type: ''});
    useEffect(() => {
        if (isStructured && !loading && result?.nodes?.length && (autoExpand.current.path !== path || autoExpand.current.type !== viewType || autoExpand.current.level < 2)) {
            autoExpand.current.level = (autoExpand.current.path === path && autoExpand.current.type === viewType) ? autoExpand.current.level + 1 : 1;
            autoExpand.current.path = path;
            autoExpand.current.type = viewType;
            dispatch(cePickerOpenPaths(result.nodes.flatMap(r => [r.path, ...r.subRows?.map(c => c.path)])));
        }
    }, [dispatch, result, isStructured, path, viewType, loading, autoExpand]);

    if (error || (!loading && !result)) {
        if (error) {
            const message = t('jcontent:label.contentManager.error.queryingContent', {details: error.message || ''});
            console.error(message);
        }

        return (
            <ContentTable isContentNotFound
                          pickerConfig={pickerConfig}
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
        currentResult.current = result;
    }

    let rows = [];
    let totalCount = 0;

    if (currentResult.current) {
        totalCount = currentResult.current.pageInfo.totalCount;
        rows = currentResult.current.nodes;
    }

    return (
        <div className="flexFluid flexCol_nowrap" style={{position: 'relative'}}>
            {loading && (
                <div className={clsx('flexCol_center', 'alignCenter', styles.loader)}>
                    <Loader size="big"/>
                </div>
            )}
            <ContentTable pickerConfig={pickerConfig}
                          path={path}
                          filesMode={filesMode}
                          rows={rows}
                          isStructured={isStructured}
                          isLoading={loading}
                          totalCount={totalCount}
            />
        </div>
    );
};

ContentLayoutContainer.propTypes = {
    pickerConfig: configPropType.isRequired
};

export default ContentLayoutContainer;
