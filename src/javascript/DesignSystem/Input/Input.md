## Input 

https://www.figma.com/file/LBIDgVFfAqt8BhycUZwVU0/Design-System?node-id=2695%3A242027

### Variants

- *Icon* : defines the left icon 
- *Interactive* : defines the right interactive icon

### Props

- *defaultValue*: The default input value, useful when not controlling the component.
- *decimalSeparator*: single character string ['.' or ','] to separate decimal number.
- *decimalScale*: If defined it limits to given decimal scale, otherwise the number is long.
- *disabled*: If `true`, the input will be disabled.
- *error*: If `true`, the input will indicate an error. This is normally obtained via context from FormControl.
- *fullWidth*: If `true`, the input will take up the full width of its container.
- *id*: The `id` of the input element.
- *variant*: `{icon: <IconCmp/>}` and / or `{interactive: <Cmp/>`
- *inputProps*: Attributes applied to the `input` element.
- *name*: Name attribute of the `input` element.
- *onBlur*: Callback fired when the `input` loose focus.
- *onChange*: Callback fired when the value is changed.
- *onFocus*: Callback fired when the `input` has focus.
- *readOnly*: It prevents the user from changing the value of the field (not from interacting with the field).
- *type*: Type of the input element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
- *value*: The `input` value, required for a controlled component.

Any other props will be propagated to the root container of the inner component. 

### Examples

``` 
<Input fullWidth
       variant={{icon: <Chat/>, interactive: <Search/>}}
       id={id}
       name={field.formDefinition.name}
       defaultValue={values[field.formDefinition.name]}
       readOnly={field.formDefinition.readOnly}
       onChange={handleChange}
       onBlur={handleBlur}
/>
```
