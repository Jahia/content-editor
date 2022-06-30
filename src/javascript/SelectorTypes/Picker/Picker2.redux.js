import {createActions, handleActions} from 'redux-actions';
import {COMBINED_REDUCERS_NAME} from '~/registerReducer';

export const {cePickerSite, cePickerMode, cePickerOpenPaths, cePickerClosePaths, cePickerPath, cePickerClearOpenPaths} = createActions('CE_PICKER_SITE', 'CE_PICKER_MODE', 'CE_PICKER_OPEN_PATHS', 'CE_PICKER_CLOSE_PATHS', 'CE_PICKER_PATH', 'CE_PICKER_CLEAR_OPEN_PATHS');

export const registerPickerReducer = registry => {
    const initialState = {
        openPaths: [],
        mode: 'pages',
        site: 'systemsite',
        path: '/sites/systemsite'
    }

    const picker = handleActions({
        [cePickerSite]: (state, action) => ({
            ...state,
            site: action.payload
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
        }},
        [cePickerClearOpenPaths]: state => ({
            ...state,
            openPaths: []
        }),
        [cePickerPath]: (state, action) => ({
            ...state,
            path: action.payload
        })
    }, initialState);

    registry.add('redux-reducer', 'picker', {targets: [COMBINED_REDUCERS_NAME], reducer: picker});
}
