## ContentTable Component

This component is used to display content data in table

### Props

-   _data_ : array contains objects that represent each row of the table
    -   _id_ : string value of the row's id
    -   _name_ : string value of the row's name
    -   _type_ : string value of the row's type
    -   _createdBy_ : string value of the row's createdBy
    -   _lastModified_ : string value of the row's lastModified
-   _columns_ : array contains objects that represent each column of the table
    -   _property_ : string value of the column's property
    -   _label_ : string value of the column's label
-   _order_: string value to order columns, possible value: ['asc', 'desc']
-   _orderBy_: string value to order the columns according to one of them
-   _labelEmpty_ : string value to show the text inside the table 
-   _classes_: object with classes for styling the component

All props is required to use this component

### Example

```jsx
const data = [
    {id: '1', name: 'Name 1', type: 'Type 1', createdBy: 'CreatedBy 1', lastModified: 'LastModified 1'},
    {id: '2', name: 'Name 2', type: 'Type 2', createdBy: 'CreatedBy 2', lastModified: 'LastModified 2'}
];
const columns = [
    {property: 'name', label: 'Label 1'},
    {property: 'type', label: 'Label 2'},
    {property: 'createdBy', label: 'Label 3'},
    {property: 'lastModified', label: 'Label 4'}
];
const order = 'asc';
const orderBy = 'name';
const labelEmpty = 'There is no data available';

<ContentTable columns={columns}
    order={order}
    orderBy={orderBy}
    data={data}
    labelEmpty={labelEmpty}
/>
```
