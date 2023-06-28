import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Loader} from '@jahia/moonstone';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import ContentTable from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentTable';
import {registry} from '@jahia/ui-extender';
import {jcontentUtils, useLayoutQuery} from '@jahia/jcontent';
import clsx from 'clsx';
import styles from './ContentLayout.scss';
import {cePickerOpenPaths} from '~/SelectorTypes/Picker/Picker.redux';
import FilesGrid from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/FilesGrid';
import PropTypes from 'prop-types';

const setRefetcher = (name, refetcherData) => {
    registry.addOrReplace('refetcher', name, refetcherData);
};

const unsetRefetcher = name => {
    delete registry.registry['refetcher-' + name];
};

const getFilesMode = (state, pickerConfig) => {
    if (state.contenteditor.picker.fileView.mode === '') {
        return pickerConfig.pickerDialog.view === 'Thumbnail' ? Constants.fileView.mode.THUMBNAILS : Constants.fileView.mode.LIST;
    }

    return state.contenteditor.picker.fileView.mode;
};

function expand(r, level) {
    return (r && level) ? r.filter(c => c.hasSubRows).flatMap(c => [c.path, ...expand(c.subRows, level - 1)]) : [];
}

export const ContentLayoutContainer = ({pickerConfig, isMultiple, accordionItemProps, dblClickSelect}) => {
    const {t} = useTranslation();
    const currentResult = useRef();
    const {mode, path, filesMode, preSearchModeMemo, viewType} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        filesMode: getFilesMode(state, pickerConfig),
        tableView: state.contenteditor.picker.tableView,
        preSearchModeMemo: state.contenteditor.picker.preSearchModeMemo,
        viewType: state.contenteditor.picker.tableView.viewType
    }), shallowEqual);
    const MAX_AUTO_EXPAND_LEVELS = 5;

    const dispatch = useDispatch();

    const additionalFragments = [];
    let autoExpandLevels = 1;
    if (mode === Constants.mode.SEARCH && preSearchModeMemo) {
        const tableConfig = jcontentUtils.getAccordionItem(registry.get('accordionItem', preSearchModeMemo), accordionItemProps)?.tableConfig;
        if (tableConfig?.fragments) {
            additionalFragments.push(...tableConfig?.fragments);
        }

        const fragments = tableConfig?.queryHandler?.getFragments();
        if (fragments) {
            additionalFragments.push(...fragments);
        }
    } else {
        const tableConfig = jcontentUtils.getAccordionItem(registry.get('accordionItem', mode), accordionItemProps)?.tableConfig;
        if (tableConfig?.fragments) {
            additionalFragments.push(...tableConfig?.fragments);
        }

        if (Number.isInteger(tableConfig.autoExpandLevels)) {
            autoExpandLevels = Math.min(tableConfig.autoExpandLevels, MAX_AUTO_EXPAND_LEVELS);
        }
    }

    const options = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        siteKey: state.site,
        path: state.contenteditor.picker.path,
        lang: state.contenteditor.ceLanguage,
        uilang: state.uilang,
        searchPath: state.contenteditor.picker.searchPath,
        searchContentType: pickerConfig.searchContentType,
        searchTerms: state.contenteditor.picker.searchTerms,
        selectableTypesTable: pickerConfig.selectableTypesTable,
        filesMode: getFilesMode(state, pickerConfig),
        pagination: state.contenteditor.picker.pagination,
        sort: state.contenteditor.picker.sort,
        tableView: state.contenteditor.picker.tableView,
        openPaths: state.contenteditor.picker.openPaths
    }));

    const {result, error, loading, isStructured, refetch} = useLayoutQuery(options, additionalFragments, undefined, accordionItemProps);

    useEffect(() => {
        setRefetcher('pickerData', {
            refetch: refetch
        });

        return () => {
            unsetRefetcher('pickerData');
        };
    });

    const autoExpand = useRef({path: '', level: 0, type: ''});
    useEffect(() => {
        if (isStructured && !loading && result?.nodes?.length && (autoExpand.current.path !== path || autoExpand.current.type !== viewType || autoExpand.current.level < autoExpandLevels)) {
            autoExpand.current.level = (autoExpand.current.path === path && autoExpand.current.type === viewType) ? autoExpand.current.level + 1 : 0;
            autoExpand.current.path = path;
            autoExpand.current.type = viewType;
            dispatch(cePickerOpenPaths(expand(result.nodes, autoExpand.current.level)));
        }
    }, [dispatch, result, isStructured, path, viewType, loading, autoExpand, autoExpandLevels]);

    if (!loading && !result) {
        if (error) {
            const message = t('jcontent:label.contentManager.error.queryingContent', {details: error.message || ''});
            console.error(message);
        }

        return (
            <ContentTable isContentNotFound
                          isMultiple={isMultiple}
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
            {(mode === Constants.mode.MEDIA || preSearchModeMemo === Constants.mode.MEDIA) && filesMode === Constants.fileView.mode.THUMBNAILS ? (
                <FilesGrid rows={rows}
                           isMultiple={isMultiple}
                           totalCount={totalCount}
                           isLoading={loading}
                           pickerConfig={pickerConfig}
                           accordionItemProps={accordionItemProps}
                           dblClickSelect={dblClickSelect}
                />
            ) : (
                <ContentTable path={path}
                              isMultiple={isMultiple}
                              rows={rows}
                              isStructured={isStructured}
                              isLoading={loading}
                              totalCount={totalCount}
                              pickerConfig={pickerConfig}
                              accordionItemProps={accordionItemProps}
                />
            )}
        </div>
    );
};

ContentLayoutContainer.propTypes = {
    pickerConfig: configPropType.isRequired,
    isMultiple: PropTypes.bool,
    accordionItemProps: PropTypes.object,
    dblClickSelect: PropTypes.func.isRequired
};

export default ContentLayoutContainer;
