import {createActions, handleActions} from 'redux-actions';
import {COMBINED_REDUCERS_NAME} from '~/registerReducer';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {toArray} from './Picker.utils';

export const {
    cePickerSite,
    cePickerMode,
    cePickerModes,
    cePickerOpenPaths,
    cePickerClosePaths,
    cePickerPath,
    cePickerClearOpenPaths,
    cePickerSetPage,
    cePickerSetPageSize,
    cePickerSetSort,
    cePickerSetSelection,
    cePickerAddSelection,
    cePickerRemoveSelection,
    cePickerSwitchSelection,
    cePickerClearSelection,
    cePickerSetTableViewMode,
    cePickerSetTableViewType,
    cePickerSetSearchTerm,
    cePickerSetSearchPath,
    cePickerSetFileViewMode,
    cePickerSetMultiple} = createActions(
    'CE_PICKER_KEY',
    'CE_PICKER_SITE',
    'CE_PICKER_MODE',
    'CE_PICKER_MODES',
    'CE_PICKER_OPEN_PATHS',
    'CE_PICKER_CLOSE_PATHS',
    'CE_PICKER_PATH',
    'CE_PICKER_CLEAR_OPEN_PATHS',
    'CE_PICKER_SET_PAGE',
    'CE_PICKER_SET_PAGE_SIZE',
    'CE_PICKER_SET_SORT',
    'CE_PICKER_SET_SELECTION',
    'CE_PICKER_ADD_SELECTION',
    'CE_PICKER_REMOVE_SELECTION',
    'CE_PICKER_SWITCH_SELECTION',
    'CE_PICKER_CLEAR_SELECTION',
    'CE_PICKER_SET_TABLE_VIEW_MODE',
    'CE_PICKER_SET_TABLE_VIEW_TYPE',
    'CE_PICKER_SET_SEARCH_TERM',
    'CE_PICKER_SET_SEARCH_PATH',
    'CE_PICKER_SET_FILE_VIEW_MODE',
    'CE_PICKER_SET_MULTIPLE'
);

export const registerPickerReducer = registry => {
    const initialState = {
        openPaths: [],
        mode: '',
        modes: [],
        preSearchModeMemo: '',
        site: 'systemsite',
        path: '/sites/systemsite',
        pagination: {currentPage: 0, pageSize: 25},
        sort: {orderBy: ''},
        selection: [],
        tableView: {
            viewMode: Constants.tableView.mode.LIST,
            viewType: Constants.tableView.type.CONTENT
        },
        searchTerms: '',
        searchPath: '',
        fileView: {
            mode: ''
        }
    };

    const picker = handleActions({
        [cePickerSite]: (state, action) => ({
            ...state,
            site: action.payload
        }),
        [cePickerMode]: (state, action) => ({
            ...state,
            mode: action.payload,
            preSearchModeMemo: action.payload === Constants.mode.SEARCH ? state.preSearchModeMemo : action.payload
        }),
        [cePickerModes]: (state, action) => ({
            ...state,
            modes: action.payload
        }),
        [cePickerOpenPaths]: (state, action) => ({
            ...state,
            openPaths: Array.from(new Set([...state.openPaths, ...action.payload]))
        }),
        [cePickerClosePaths]: (state, action) => {
            const s2 = new Set([...action.payload]);
            return {
                ...state,
                openPaths: Array.from(new Set(state.openPaths.filter(p => !s2.has(p))))
            };
        },
        [cePickerClearOpenPaths]: state => ({
            ...state,
            openPaths: []
        }),
        [cePickerPath]: (state, action) => ({
            ...state,
            path: action.payload,
            searchPath: (state.searchPath === '' || state.searchPath.indexOf('/') >= 0) ? action.payload : state.searchPath,
            searchTerms: '',
            pagination: {
                ...state.pagination,
                currentPage: 0
            }
        }),
        [cePickerSetPage]: (state, action) => ({
            ...state,
            pagination: {
                ...state.pagination,
                currentPage: action.payload
            }
        }),
        [cePickerSetPageSize]: (state, action) => ({
            ...state,
            pagination: {
                currentPage: 0,
                pageSize: action.payload
            }
        }),
        [cePickerSetSort]: (state, action) => ({
            ...state,
            sort: action.payload
        }),
        [cePickerSetSelection]: (state, action) => ({
            ...state,
            selection: action.payload
        }),
        [cePickerAddSelection]: (state, action) => ({
            ...state,
            selection: state.selection.concat(toArray(action.payload).filter(p => state.selection.indexOf(p) === -1))
        }),
        [cePickerRemoveSelection]: (state, action) => ({
            ...state,
            selection: state.selection.filter(s => toArray(action.payload).indexOf(s) === -1)
        }),
        [cePickerSwitchSelection]: (state, action) => ({
            ...state,
            selection: (state.selection.indexOf(action.payload) === -1) ? [...state.selection, action.payload] : state.selection.filter(s => action.payload !== s)
        }),
        [cePickerClearSelection]: state => ({
            ...state,
            selection: []
        }),
        [cePickerSetTableViewMode]: (state, action) => ({
            ...state,
            tableView: {
                ...state.tableView,
                viewMode: action.payload
            }
        }),
        [cePickerSetTableViewType]: (state, action) => ({
            ...state,
            tableView: {
                ...state.tableView,
                viewType: action.payload
            }
        }),
        [cePickerSetSearchTerm]: (state, action) => ({
            ...state,
            searchTerms: action.payload,
            mode: action.payload === '' ? state.preSearchModeMemo : Constants.mode.SEARCH
        }),
        [cePickerSetSearchPath]: (state, action) => ({
            ...state,
            searchPath: action.payload
        }),
        [cePickerSetFileViewMode]: (state, action) => ({
            ...state,
            fileView: {
                ...state.fileView,
                mode: action.payload
            }
        }),
        [cePickerSetMultiple]: (state, action) => ({
            ...state,
            multiple: action.payload
        }),
        FILEUPLOAD_UPDATE_UPLOAD: (state, action) => ({
            ...state,
            selection: action.payload.uuid ? (state.multiple ? [action.payload.uuid, ...state.selection] : [action.payload.uuid]) : state.selection
        })
    }, initialState);

    registry.add('redux-reducer', 'picker', {targets: [COMBINED_REDUCERS_NAME], reducer: picker});
};
