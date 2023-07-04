import {createActions, handleActions} from 'redux-actions';
import {combineReducers} from 'redux';

export const {ceToggleSections} = createActions('CE_TOGGLE_SECTIONS');
export const {ceSwitchLanguage} = createActions('CE_SWITCH_LANGUAGE');

export const COMBINED_REDUCERS_NAME = 'contenteditor';

export const registerReducer = registry => {
    const toggleSections = handleActions({
        [ceToggleSections]: (state, action) => ({
            ...state,
            [action.payload.key]: action.payload.sections
        })}, {});

    const languageReducer = handleActions({
        [ceSwitchLanguage]: (state, action) => action.payload
    }, '');

    registry.add('redux-reducer', 'ceToggleSections', {targets: [COMBINED_REDUCERS_NAME], reducer: toggleSections});
    registry.add('redux-reducer', 'ceLanguage', {targets: [COMBINED_REDUCERS_NAME], reducer: languageReducer});

    const reducersArray = registry.find({type: 'redux-reducer', target: COMBINED_REDUCERS_NAME});
    const reducerObj = {};
    reducersArray.forEach(r => {
        reducerObj[r.key] = r.reducer;
    });

    const ceReducer = combineReducers(reducerObj);

    registry.add('redux-reducer', COMBINED_REDUCERS_NAME, {targets: ['root'], reducer: ceReducer});
};
