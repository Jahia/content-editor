## Input 

https://www.figma.com/file/MfkyPjuj0VdUclIIVb8lHG/Design-System-(Full)?node-id=2303%3A362477

### Props

- *checked*: If `true`, the toggle will be checked else, the toggle will be unchecked.
- *disabled*: If `true`, the toggle will be disabled.
- *readOnly*: It prevents the user from changing the value of the Toggle (the Toggle field is still focusable).
- *onBlur*: Callback fired when the `checkbox` loose focus.
- *onChange*: Callback fired when the Toggle is switched.
- *onFocus*: Callback fired when the `checkbox` has focus.

Any other props will be propagated to the root container of the inner Switch component from material UI. 

### Examples

``` 
<Toggle checked={checked}
        onChange={(event, checked) => setChecked(checked)}
/>
```
