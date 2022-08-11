import {useDispatch, useSelector} from 'react-redux';
import {
    cePickerAddSelection,
    cePickerRemoveSelection,
    cePickerSwitchSelection
} from '~/SelectorTypes/Picker/Picker2.redux';
import {useGetLatest} from 'react-table';

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
        checked: selection.find(o => o.path === row.original.path) !== undefined
    };
};

const defaultGetToggleAllRowsSelectedProps = instance => ({
    onChange: e => {
        instance.toggleAllRowsSelected(e);
    },
    indeterminate: instance.anySelected && !instance.allSelected,
    checked: instance.anySelected
});

const flattenTree = function (rows) {
    const items = [];
    collectItems(rows);
    return items;

    function collectItems(arrayData) {
        for (let i = 0; i < arrayData.length; i++) {
            items.push(arrayData[i]);
            collectItems(arrayData[i].subRows || []);
        }
    }
};

function useInstance(instance) {
    const {getHooks, rows} = instance;
    const getInstance = useGetLatest(instance);
    const selection = useSelector(state => state.contenteditor.picker.selection);
    const dispatch = useDispatch();

    const flattenRows = flattenTree(rows).map(r => r.original);
    const selIdSet = new Set(selection.map(r => r.uuid));
    const anySelected = selection.length > 0;
    const allSelected = anySelected &&
        selection.length >= flattenRows.length &&
        flattenRows.every(r => selIdSet.has(r.uuid)); // Check if all rows are in selection set

    const toggleRowSelected = row => {
        if (row.original.isSelectable) {
            dispatch(cePickerSwitchSelection(row.original));
        }
    };

    const toggleAllRowsSelected = () => {
        if (allSelected) {
            dispatch(cePickerRemoveSelection(flattenRows));
        } else {
            dispatch(cePickerAddSelection(flattenRows.filter(r => r.isSelectable)));
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

