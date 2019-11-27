## CheckBox

### Figma

[https://www.figma.com/file/QzGJqeK0jJDcXb2O15PTTB/Category-imput-picker-multipicker?node-id=0%3A1](https://www.figma.com/file/QzGJqeK0jJDcXb2O15PTTB/Category-imput-picker-multipicker?node-id=0%3A1)


### Variants

none

### Props

[All props are detailed in the doc of react-DropdownTreeSelect.](https://dowjones.github.io/react-dropdown-tree-select/#/story/readme)

### Examples

```jsx
const data = [
    {
        label: 'VP Accounting',
        checked: true,
        children: [
            {
                label: 'iWay',
                children: [
                    {label: 'Universidad de Especialidades del Espíritu Santo'},
                    {label: 'Marmara University'},
                    {label: 'Baghdad College of Pharmacy'}
                ]
            },
            {
                label: 'KDB',
                children: [
                    {label: 'Latvian University of Agriculture'},
                    {label: 'Dublin Institute of Technology'}
                ]
            },
            {
                label: 'Justice',
                children: [
                    {label: 'Baylor University'},
                    {label: 'Massachusetts College of Art'},
                    {label: 'Universidad Técnica Latinoamericana'},
                    {label: 'Saint Louis College'},
                    {label: 'Scott Christian University'}
                ]
            },
            {
                label: 'Utilization Review',
                children: [
                    {label: 'University of Minnesota - Twin Cities Campus'},
                    {label: 'Moldova State Agricultural University'},
                    {label: 'Andrews University'},
                    {label: 'Usmanu Danfodiyo University Sokoto'}
                ]
            },
            {
                label: 'Norton Utilities',
                children: [
                    {label: 'Universidad Autónoma del Caribe'},
                    {label: 'National University of Uzbekistan'},
                    {label: 'Ladoke Akintola University of Technology'},
                    {label: 'Kohat University of Science and Technology  (KUST)'},
                    {label: 'Hvanneyri Agricultural University'}
                ]
            }
        ]
    }
];

<DropdownTreeSelect
    data={data}
    readOnly={false}
    disabled
    onChange={console.log}
    onAction={console.log}
    onNodeToggle={console.log}
/>
```
