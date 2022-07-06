import {createActions, handleActions} from 'redux-actions';
import {combineReducers} from 'redux';

export const {ceToggleSections} = createActions('CE_TOGGLE_SECTIONS');

export const COMBINED_REDUCERS_NAME = 'contenteditor';

export const DEFAULT_OPENED_SECTIONS = {content: true, listOrdering: true};

export const registerReducer = registry => {
    const toggleSections = handleActions({
        [ceToggleSections]: (state, action) => action.payload
    }, DEFAULT_OPENED_SECTIONS);

    registry.add('redux-reducer', 'ceToggleSections', {targets: [COMBINED_REDUCERS_NAME], reducer: toggleSections});

    const reducersArray = registry.find({type: 'redux-reducer', target: COMBINED_REDUCERS_NAME});
    const reducerObj = {};
    reducersArray.forEach(r => {
        reducerObj[r.key] = r.reducer;
    });

    const ceReducer = combineReducers(reducerObj);

    registry.add('redux-reducer', COMBINED_REDUCERS_NAME, {targets: ['root'], reducer: ceReducer});
};
