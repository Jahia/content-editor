## InfoPanel

This component is used to display a panel of data

### Props

-   _panelTitle_: String
-   _infos_: Array(Object) list of infos to display
  -   _label_: String
  -   _value_: String
- _variant_: string one-column(default) or two-column

### Example

```
<InfoPanel panelTitle="Details" infos={[{label: 'current state', value: 'Work In Progress'}]} variant="two-column"/>
```
