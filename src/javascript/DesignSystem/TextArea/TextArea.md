## TextArea Component

This component is a textarea field for forms

### Variants

-   normal (default)
-   disabled
-   error

### Props

-   _value_: the value of the component
-   _ClassNames_ : object with classes for styling the Component
    -   _container_ : string className for container
    -   _textarea_ : string className for the textarea himself

All props given to this component is given to the html TextArea element

### Examples

#### normal

```jsx
<TextArea value={'Kevan'} />
```

#### disabled

```jsx
<TextArea value={'Florent'} disabled />
```

#### error

```jsx
<TextArea value={'<3'} error />
```
