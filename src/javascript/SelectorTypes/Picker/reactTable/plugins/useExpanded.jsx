import React from 'react';
import {
    useGetLatest,
    actions,
    useMountedLayoutEffect,
    makePropGetter,
    ensurePluginOrder
} from 'react-table';

// Actions
actions.resetExpanded = 'resetExpanded';
actions.toggleRowExpanded = 'toggleRowExpanded';
actions.toggleAllRowsExpanded = 'toggleAllRowsExpanded';

const expandRows = (rows, {manualExpandedKey, expanded, expandSubRows = true}) => {
    const expandedRows = [];

    const handleRow = (row, addToExpandedRows = true) => {
        row.isExpanded =
            (row.original && row.original[manualExpandedKey]) || expanded[row.id];

        row.canExpand = row.subRows && Boolean(row.subRows.length);

        if (addToExpandedRows) {
            expandedRows.push(row);
        }

        if (row.subRows && row.subRows.length && row.isExpanded) {
            row.subRows.forEach(row => handleRow(row, expandSubRows));
        }
    };

    rows.forEach(row => handleRow(row));

    return expandedRows;
};

export const useExpanded = hooks => {
    hooks.getToggleAllRowsExpandedProps = [defaultGetToggleAllRowsExpandedProps];
    hooks.getToggleRowExpandedProps = [defaultGetToggleRowExpandedProps];
    hooks.stateReducers.push(reducer);
    hooks.useInstance.push(useInstance);
    hooks.prepareRow.push(prepareRow);
};

useExpanded.pluginName = 'useExpanded';

const defaultGetToggleAllRowsExpandedProps = (props, {instance}) => [
    props,
    {
        onClick: e => {
            e.preventDefault();
            e.stopPropagation();
            instance.toggleAllRowsExpanded();
        },
        style: {
            cursor: 'pointer'
        },
        title: 'Toggle All Rows Expanded'
    }
];

const defaultGetToggleRowExpandedProps = (props, {row}) => [
    props,
    {
        onClick: e => {
            if (e.target.matches('.moonstone-TableCell > svg') || e.target.matches('.moonstone-TableCell > svg *')) {
                e.preventDefault();
                e.stopPropagation();
                row.toggleRowExpanded();
            }
        },
        style: {
            cursor: 'pointer'
        },
        title: 'Toggle Row Expanded'
    }
];

// Reducer
function reducer(state, action, previousState, instance) {
    if (action.type === actions.init) {
        return {
            expanded: {},
            ...state
        };
    }

    if (action.type === actions.resetExpanded) {
        return {
            ...state,
            expanded: instance.initialState.expanded || {}
        };
    }

    if (action.type === actions.toggleAllRowsExpanded) {
        const {value} = action;
        const {rowsById} = instance;

        const isAllRowsExpanded =
            Object.keys(rowsById).length === Object.keys(state.expanded).length;

        const expandAll = typeof value !== 'undefined' ? value : !isAllRowsExpanded;

        if (expandAll) {
            const expanded = {};

            Object.keys(rowsById).forEach(rowId => {
                expanded[rowId] = true;
            });

            return {
                ...state,
                expanded
            };
        }

        return {
            ...state,
            expanded: {}
        };
    }

    if (action.type === actions.toggleRowExpanded) {
        const {id, value: setExpanded} = action;
        const exists = state.expanded[id];

        const shouldExist =
            typeof setExpanded !== 'undefined' ? setExpanded : !exists;

        if (!exists && shouldExist) {
            return {
                ...state,
                expanded: {
                    ...state.expanded,
                    [id]: true
                }
            };
        }

        if (exists && !shouldExist) {
            const {[id]: _, ...rest} = state.expanded;
            return {
                ...state,
                expanded: rest
            };
        }

        return state;
    }
}

function useInstance(instance) {
    const {
        data,
        rows,
        rowsById,
        manualExpandedKey = 'expanded',
        paginateExpandedRows = true,
        expandSubRows = true,
        autoResetExpanded = false,
        getHooks,
        plugins,
        state: {expanded},
        dispatch
    } = instance;

    ensurePluginOrder(
        plugins,
        ['useSortBy', 'useGroupBy', 'usePivotColumns', 'useGlobalFilter'],
        'useExpanded'
    );

    const getAutoResetExpanded = useGetLatest(autoResetExpanded);

    let isAllRowsExpanded = Boolean(
        Object.keys(rowsById).length && Object.keys(expanded).length
    );

    if (isAllRowsExpanded) {
        if (Object.keys(rowsById).some(id => !expanded[id])) {
            isAllRowsExpanded = false;
        }
    }

    // Bypass any effects from firing when this changes
    useMountedLayoutEffect(() => {
        if (getAutoResetExpanded()) {
            dispatch({type: actions.resetExpanded});
        }
    }, [dispatch, data]);

    const toggleRowExpanded = React.useCallback(
        (id, value) => {
            dispatch({type: actions.toggleRowExpanded, id, value});
        },
        [dispatch]
    );

    const toggleAllRowsExpanded = React.useCallback(
        value => dispatch({type: actions.toggleAllRowsExpanded, value}),
        [dispatch]
    );

    const expandedRows = React.useMemo(() => {
        if (paginateExpandedRows) {
            return expandRows(rows, {manualExpandedKey, expanded, expandSubRows});
        }

        return rows;
    }, [paginateExpandedRows, rows, manualExpandedKey, expanded, expandSubRows]);

    const expandedDepth = React.useMemo(() => findExpandedDepth(expanded), [
        expanded
    ]);

    const getInstance = useGetLatest(instance);

    const getToggleAllRowsExpandedProps = makePropGetter(
        getHooks().getToggleAllRowsExpandedProps,
        {instance: getInstance()}
    );

    Object.assign(instance, {
        preExpandedRows: rows,
        expandedRows,
        rows: expandedRows,
        expandedDepth,
        isAllRowsExpanded,
        toggleRowExpanded,
        toggleAllRowsExpanded,
        getToggleAllRowsExpandedProps
    });
}

function prepareRow(row, {instance: {getHooks}, instance}) {
    row.toggleRowExpanded = set => instance.toggleRowExpanded(row.id, set);

    row.getToggleRowExpandedProps = makePropGetter(
        getHooks().getToggleRowExpandedProps,
        {
            instance,
            row
        }
    );
}

function findExpandedDepth(expanded) {
    let maxDepth = 0;

    Object.keys(expanded).forEach(id => {
        const splitId = id.split('.');
        maxDepth = Math.max(maxDepth, splitId.length);
    });

    return maxDepth;
}
