import {useDispatch, useSelector} from 'react-redux';
import {cePickerAddSelection, cePickerClearSelection} from '~/SelectorTypes/Picker/Picker2.redux';
import {useGetLatest} from 'react-table';
import {batchActions} from 'redux-batched-actions';

export const useRowSelection = hooks => {
    hooks.getToggleRowSelectedProps = defaultGetToggleRowSelectedProps;
    hooks.getToggleAllRowsSelectedProps = () => {};
    hooks.useInstance.push(useInstance);
    hooks.prepareRow.push(prepareRow);
};

useRowSelection.pluginName = 'useRowSelection';

function prepareRow(row, {instance}) {
    row.toggleRowSelected = () => instance.toggleRowSelected(row);
    row.getToggleRowSelectedProps = () => (instance.getHooks().getToggleRowSelectedProps(instance.selection, row));
}

const defaultGetToggleRowSelectedProps = (selection, row) => {
    return {
        onChange: () => {
            row.toggleRowSelected();
        },
        checked: selection.find(o => o.path === row.original.path) !== undefined
    };
};

function useInstance(instance) {
    const {getHooks} = instance;
    const getInstance = useGetLatest(instance);
    const {selection} = useSelector(state => ({selection: state.contenteditor.picker.selection}));
    const dispatch = useDispatch();

    const anySelected = selection.length > 0;

    const toggleRowSelected = row => {
        if (!['jnt:folder'].includes(row.original.primaryNodeType.name)) {
            dispatch(batchActions([cePickerClearSelection(), cePickerAddSelection({
                uuid: row.original.uuid,
                path: row.original.path
            })]));
        }
    };

    const toggleAllRowsSelected = () => {};

    const getToggleAllRowsSelectedProps = handlerFcn => (getHooks().getToggleAllRowsSelectedProps(getInstance(), handlerFcn));
    Object.assign(instance, {
        toggleRowSelected,
        toggleAllRowsSelected,
        getToggleAllRowsSelectedProps,
        selection,
        anySelected
    });
}

