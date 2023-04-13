## MultipleInput

This component is used to select or enter multiple data in one input

### Props

-   _readOnly_: bool value to know the status of the field if it's readOnly or not
-   _creatable_: Bool if true user can add element to the list (useful for tag list)
-   _options_: Array of object
    -   _value_: string
    -   _label_: string
-   _placeholder_: string

### Example

```
<MultipleInput
            creatable
            options={suggestions}
            placeholder={text('placeholder', '')}
            readOnly={boolean('readOnly', false)}
            formatCreateLabel={val => `Create tag "${val}"`}
        />
```
