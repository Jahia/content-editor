import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Loader} from '@jahia/moonstone';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import ContentTable from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentTable';
import {registry} from '@jahia/ui-extender';
import {jcontentUtils, useLayoutQuery} from '@jahia/jcontent';
import clsx from 'clsx';
import styles from './ContentLayout.scss';
import {cePickerOpenPaths} from '~/SelectorTypes/Picker/Picker2.redux';
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

export const ContentLayoutContainer = ({pickerConfig, accordionItemProps}) => {
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

    const dispatch = useDispatch();

    const additionalFragments = [];
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

    const {result, error, loading, isStructured, refetch} = useLayoutQuery(options, additionalFragments);

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
            dispatch(cePickerOpenPaths(result.nodes.filter(n => n.hasSubRows).flatMap(r => [r.path, ...r.subRows?.filter(c => c.hasSubRows).map(c => c.path)])));
        }
    }, [dispatch, result, isStructured, path, viewType, loading, autoExpand]);

    if (!loading && !result) {
        if (error) {
            const message = t('jcontent:label.contentManager.error.queryingContent', {details: error.message || ''});
            console.error(message);
        }

        return (
            <ContentTable isContentNotFound
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
            {(mode === Constants.mode.MEDIA || preSearchModeMemo === Constants.mode.MEDIA) && filesMode === Constants.fileView.mode.THUMBNAILS ?
                (<FilesGrid rows={rows} totalCount={totalCount} isLoading={loading} accordionItemProps={accordionItemProps}/>) :
                (<ContentTable path={path}
                               rows={rows}
                               isStructured={isStructured}
                               isLoading={loading}
                               totalCount={totalCount}
                               accordionItemProps={accordionItemProps}
                />)}
        </div>
    );
};

ContentLayoutContainer.propTypes = {
    pickerConfig: configPropType.isRequired,
    accordionItemProps: PropTypes.object
};

export default ContentLayoutContainer;
