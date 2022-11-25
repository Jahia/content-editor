import {useDispatch, useSelector} from 'react-redux';
import {
    cePickerAddSelection,
    cePickerRemoveSelection,
    cePickerSwitchSelection
} from '~/SelectorTypes/Picker/Picker.redux';
import {useGetLatest} from 'react-table';
import {flattenTree} from '~/SelectorTypes/Picker/Picker.utils';

export const useRowMultipleSelection = hooks => {
    hooks.getToggleRowSelectedProps = defaultGetToggleRowSelectedProps;
    hooks.getToggleAllRowsSelectedProps = defaultGetToggleAllRowsSelectedProps;
    hooks.useInstance.push(useInstance);
    hooks.prepareRow.push(prepareRow);
};

useRowMultipleSelection.pluginName = 'useRowMultipleSelection';

function prepareRow(row, {instance}) {
    row.toggleRowSelected = () => instance.toggleRowSelected(row);
    row.getToggleRowSelectedProps = () => (instance.getHooks().getToggleRowSelectedProps(instance.selection, row));
}

const defaultGetToggleRowSelectedProps = (selection, row) => {
    return {
        onChange: () => {
            row.toggleRowSelected();
        },
        checked: selection.find(o => o === row.original.uuid) !== undefined
    };
};

const defaultGetToggleAllRowsSelectedProps = instance => ({
    onChange: e => {
        instance.toggleAllRowsSelected(e);
    },
    indeterminate: instance.anySelected && !instance.allSelected,
    checked: instance.anySelected
});

function useInstance(instance) {
    const {getHooks, rows} = instance;
    const getInstance = useGetLatest(instance);
    const selection = useSelector(state => state.contenteditor.picker.selection);
    const dispatch = useDispatch();

    const selectableRows = flattenTree(rows).map(r => r.original).filter(r => r.isSelectable);
    const rowsSet = new Set(selectableRows.map(r => r.uuid));
    const anySelected = selection.length > 0 && selection.some(r => rowsSet.has(r));
    const allSelected = anySelected &&
        selection.length >= selectableRows.length &&
        selectableRows.every(r => selection.indexOf(r.uuid) !== -1); // Check if all rows are in selection set

    const toggleRowSelected = row => {
        if (row.original.isSelectable) {
            dispatch(cePickerSwitchSelection(row.original.uuid));
        }
    };

    const toggleAllRowsSelected = () => {
        if (allSelected) {
            dispatch(cePickerRemoveSelection(selectableRows.map(n => n.uuid)));
        } else {
            dispatch(cePickerAddSelection(selectableRows.map(n => n.uuid)));
        }
    };

    const getToggleAllRowsSelectedProps = handlerFcn => (getHooks().getToggleAllRowsSelectedProps(getInstance(), handlerFcn));
    Object.assign(instance, {
        toggleRowSelected,
        toggleAllRowsSelected,
        getToggleAllRowsSelectedProps,
        selection,
        allSelected,
        anySelected
    });
}

