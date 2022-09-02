import React from 'react';
import {ensurePluginOrder, makePropGetter} from 'react-table';

const expandRows = (rows, {manualExpandedKey, isExpanded, expandSubRows = true}) => {
    const expandedRows = [];

    const handleRow = (row, addToExpandedRows = true) => {
        row.isExpanded =
            (row.original && row.original[manualExpandedKey]) || isExpanded(row.original);

        row.canExpand = (row.subRows && Boolean(row.subRows.length)) || row.original.hasSubRows;

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
    hooks.getToggleRowExpandedProps = [defaultGetToggleRowExpandedProps];
    hooks.useInstance.push(useInstance);
    hooks.prepareRow.push(prepareRow);
};

useExpanded.pluginName = 'useExpanded';

const defaultGetToggleRowExpandedProps = (props, {row}) => [
    props,
    {
        onClick: e => {
            if (e.target.matches('.moonstone-TableCell > svg') || e.target.matches('.moonstone-TableCell > svg *')) {
                e.preventDefault();
                e.stopPropagation();
                row.toggleRowExpanded(!row.isExpanded);
            }
        },
        style: {
            cursor: 'pointer'
        },
        title: 'Toggle Row Expanded'
    }
];

function useInstance(instance) {
    const {
        rows,
        manualExpandedKey = 'expanded',
        paginateExpandedRows = true,
        expandSubRows = true,
        plugins,
        isExpanded
    } = instance;

    ensurePluginOrder(
        plugins,
        ['useSortBy', 'useGroupBy', 'usePivotColumns', 'useGlobalFilter'],
        'useExpanded'
    );

    const expandedRows = React.useMemo(() => {
        if (paginateExpandedRows) {
            return expandRows(rows, {manualExpandedKey, isExpanded, expandSubRows});
        }

        return rows;
    }, [paginateExpandedRows, rows, manualExpandedKey, isExpanded, expandSubRows]);

    Object.assign(instance, {
        preExpandedRows: rows,
        expandedRows,
        rows: expandedRows
    });
}

function prepareRow(row, {instance: {getHooks}, instance}) {
    row.toggleRowExpanded = set => instance.onExpand(row.id, set);
    row.getToggleRowExpandedProps = makePropGetter(
        getHooks().getToggleRowExpandedProps,
        {
            instance,
            row
        }
    );
}
