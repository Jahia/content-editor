## PickerDialog Component

This component displays the node tree structure and content within each node to allow an element to be selected.

### Props

-   _children_: function value to render the children element of the component
-   _nodeTreeConfigs_: string value to order the columns according to one of them
-   _lang_: string value of the node's language
-   _site_: string value of the node's site key
-   _onCloseDialog_: function value to close the dialog
-   _onItemSelection_: function value to select item
-   _idInput_: string value of the input Id
-   _modalCancelLabel_: string value of dialog's cancel button label
-   _modalDoneLabel_: string value of dialog's done button label
-   _classes_: object with classes for styling the component
-   _displayTree_ : if false, the left tree is not displayed, default is true.
-   _initialPath_: string initial path to display

All props is required to use this component

### Example

```jsx
const id = 'id';
const site = 'siteKey';
const lang = 'en';
const modalCancelLabel = 'Cancel';
const modalDoneLabel = 'Done';
const nodeTreeConfigs = [{
    rootPath: '/files',
    selectableTypes: ['jnt:folder'],
    type: 'files',
    openableTypes: ['jnt:folder'],
    rootLabel: 'Browse files',
    key: 'browse-tree-files'
}];

<PickerDialog idInput={id}
              site={site}
              lang={lang}
              nodeTreeConfigs={nodeTreeConfigs}
              modalCancelLabel={modalCancelLabel}
              modalDoneLabel={modalDoneLabel}
              onCloseDialog={() => setIsOpen(false)}
              onItemSelection={image => {
                  formik.setFieldValue(field.formDefinition.name, image[0].uuid, true);
                  setIsOpen(false);
              }}
>
    {(setSelectedItem, selectedPath) => (
        <ImageListQuery field={field}
                        setSelectedItem={setSelectedItem}
                        selectedPath={selectedPath}
                        formik={formik}
        />
    )}
</PickerDialog>
```
