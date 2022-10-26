import {reactTable} from '@jahia/jcontent';
import {CellVisibleActions} from '~/SelectorTypes/Picker/reactTable/columns/CellVisibleActions';
import {FileSizeCell} from '~/SelectorTypes/Picker/reactTable/columns/FileSizeCell';
import {RelPathCell} from '~/SelectorTypes/Picker/reactTable/columns/RelPathCell';
import {LocationCell} from '~/SelectorTypes/Picker/reactTable/columns/LocationCell';

export const allColumnData = [
    {
        id: 'publicationStatus',
        sortable: false,
        Header: '',
        Cell: reactTable.CellPublicationStatus,
        width: '15px'
    },
    {
        id: 'selection',
        sortable: false,
        Header: reactTable.HeaderSelection,
        Cell: reactTable.CellSelection,
        width: '50px'
    },
    {
        id: 'name',
        accessor: 'displayName',
        label: 'jcontent:label.contentManager.listColumns.name',
        sortable: true,
        property: 'displayName',
        Cell: reactTable.CellName,
        Header: reactTable.Header,
        width: '300px'
    },
    {
        id: 'type',
        accessor: 'primaryNodeType.displayName',
        label: 'jcontent:label.contentManager.listColumns.type',
        sortable: true,
        property: 'primaryNodeType.displayName',
        Cell: reactTable.CellType,
        Header: reactTable.Header,
        width: '180px'
    },
    {
        id: 'lastModified',
        accessor: 'lastModified.value',
        label: 'jcontent:label.contentManager.listColumns.lastModified',
        sortable: true,
        property: 'lastModified.value',
        Cell: reactTable.CellLastModified,
        Header: reactTable.Header,
        width: '290px'
    },
    {
        id: 'createdBy',
        accessor: 'createdBy.value',
        label: 'jcontent:label.contentManager.listColumns.createdBy',
        sortable: true,
        property: 'createdBy.value',
        Cell: reactTable.Cell
    },
    {
        id: 'fileSize',
        Cell: FileSizeCell
    },
    {
        id: 'relPath',
        Cell: RelPathCell
    },
    {
        id: 'location',
        Cell: LocationCell,
        sortable: false,
        label: 'content-editor:label.contentEditor.edit.advancedOption.usages.path',
        Header: reactTable.Header,
        width: '300px'
    },
    {
        id: 'status',
        label: 'jcontent:label.contentManager.listColumns.status',
        sortable: false,
        Header: '',
        Cell: reactTable.CellStatus
    },
    {
        id: 'visibleActions',
        Header: '',
        Cell: CellVisibleActions,
        width: '60px',
        sortable: false
    }
];
