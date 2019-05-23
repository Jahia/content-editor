## PickerEmpty

This component is used to display empty picker inside the field to allow selecting item.

### Props

-   _readOnly_: bool value to know the status of the field if it's readOnly or not
-   _pickerLabel_: string value of the picker' label
-   _pickerIcon_: element value contains the icon used by the picker
-   _children_: function value to render the children element of the component
-   _classes_: object with classes for styling the component

### Example

```
const readOnly = false;
const pickerLabel = 'Add item';

<PickerEmpty readOnly={readOnly}
             pickerLabel={pickerLabel}
             pickerIcon={<ImageIcon/>}
>
{(setSelectedItem, selectedPath) => (
    <ImageListQuery field={field}
                    setSelectedItem={setSelectedItem}
                    selectedPath={selectedPath}
                    formik={formik}
}}
</PickerEmpty>
```
