import {createActions, handleActions} from 'redux-actions';
import {COMBINED_REDUCERS_NAME} from '~/registerReducer';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {toArray} from './Picker2.utils';

export const {
    cePickerSite,
    cePickerContextSite,
    cePickerMode,
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
    cePickerSetTableViewType} = createActions(
    'CE_PICKER_SITE',
    'CE_PICKER_CONTEXT_SITE',
    'CE_PICKER_MODE',
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
    'CE_PICKER_SET_TABLE_VIEW_TYPE');

export const registerPickerReducer = registry => {
    const initialState = {
        openPaths: [],
        mode: 'picker-pages',
        site: 'systemsite',
        contextSite: 'systemsite',
        path: '/sites/systemsite',
        pagination: {currentPage: 0, pageSize: 25},
        sort: {
            order: 'ASC',
            orderBy: 'lastModified.value'
        },
        selection: [],
        tableView: {
            viewMode: Constants.tableView.mode.LIST,
            viewType: Constants.tableView.type.CONTENT
        }
    };

    const picker = handleActions({
        [cePickerSite]: (state, action) => ({
            ...state,
            site: action.payload
        }),
        [cePickerContextSite]: (state, action) => ({
            ...state,
            contextSite: action.payload
        }),
        [cePickerMode]: (state, action) => ({
            ...state,
            mode: action.payload
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
            selection: state.selection.concat(toArray(action.payload).filter(p => !state.selection.find(s => s.uuid === p.uuid)))
        }),
        [cePickerRemoveSelection]: (state, action) => ({
            ...state,
            selection: state.selection.filter(s => toArray(action.payload).find(s1 => s1.path === s.path) === undefined)
        }),
        [cePickerSwitchSelection]: (state, action) => ({
            ...state,
            selection: (state.selection.find(s => s.path === action.payload.path) === undefined) ? [...state.selection, action.payload] : state.selection.filter(s => action.payload.path !== s.path)
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
        })
    }, initialState);

    registry.add('redux-reducer', 'picker', {targets: [COMBINED_REDUCERS_NAME], reducer: picker});
};
