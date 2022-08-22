import {reactTable} from '@jahia/jcontent';

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
    }
];
