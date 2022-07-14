import React, {Suspense} from 'react';

const CellLastModified = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.reactTable.CellLastModified})));
const CellName = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.reactTable.CellName})));
const CellPublicationStatus = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.reactTable.CellPublicationStatus})));
const CellSelection = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.reactTable.CellSelection})));
const Header = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.reactTable.Header})));

const suspended = E => props => (
    <Suspense fallback="Loading ...">
        <E {...props}/>
    </Suspense>
);

export const allColumnData = [
    {
        id: 'publicationStatus',
        sortable: false,
        Header: '',
        Cell: suspended(CellPublicationStatus)
    },
    {
        id: 'selection',
        sortable: false,
        Header: '',
        Cell: suspended(CellSelection)
    },
    {
        id: 'name',
        accessor: 'displayName',
        label: 'jcontent:label.contentManager.listColumns.name',
        sortable: true,
        property: 'displayName',
        Cell: suspended(CellName),
        Header: suspended(Header)
    },
    {
        id: 'lastModified',
        accessor: 'lastModified.value',
        label: 'jcontent:label.contentManager.listColumns.lastModified',
        sortable: true,
        property: 'lastModified.value',
        Cell: suspended(CellLastModified),
        Header: suspended(Header)
    }
];
