## Picker

This component is used to display picker inside the field to allow selecting/edit item.

### Props

-   _readOnly_: bool value to know the status of the field if it's readOnly or not
-   _emptyLabel_: string value of the picker' label
-   _emptyIcon_: element value contains the icon used by the picker
-   _children_: function value to render the children element of the component
-   _classes_: object with classes for styling the component
-   _fieldData_: object with selected data (if no content selected send null)
    -   _url_ : url of the displayed image / icon
    -   _name_ : name part of the field
    -   _info_ : info part of the field
-   _onClick_: function

### Example

```
<Picker
            readOnly={boolean('readOnly', false)}
            fieldData={{
                url:
                    'http://www.open-source-guide.com/var/site_smile/storage/images/guide-os/solutions/applications/cms/jahia-digital-factory/362440-239-fre-FR/Jahia-Digital-Factory_logo_solution_categorie.png',
                name: 'Jahia',
                info: 'best company in the world'
            }}
        />


        <Picker
                    readOnly={boolean('readOnly', false)}
                    emptyLabel={text('pickerLabel', 'add image')}
                    emptyIcon={<InsertDriveFile/>}
                />
```
