## ContentTableHeader Component

This component is used by ContentTable component to show the header part of the table.

### Props

-   _columns_ : array contains objects that represent each column of the table
    -   _property_ : string value of the column's property
    -   _label_ : string value of the column's label
-   _order_: string value to order columns, possible value: ['asc', 'desc']
-   _orderBy_: string value to order the columns according to one of them

All props is required to use this component

### Example

```jsx
const columns = [
    {property: 'name', label: 'Label 1'},
    {property: 'type', label: 'Label 2'},
    {property: 'createdBy', label: 'Label 3'},
    {property: 'lastModified', label: 'Label 4'}
];
const order = 'asc';
const orderBy = 'name';

<ContentTableHeader
    columns={columns}
    order={order}
    orderBy={orderBy}
/>
```
