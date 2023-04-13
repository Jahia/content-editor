## Card

### Figma

[https://www.figma.com/file/MfkyPjuj0VdUclIIVb8lHG/Design-System?node-id=2303%3A342205](https://www.figma.com/file/MfkyPjuj0VdUclIIVb8lHG/Design-System?node-id=2303%3A342205)


### Variants

- Normal - Not done, as Content editor don't need it
- Selectable - Done, it's the default view

### Props

- *image* : Object, the image to display with src and alt
  - *src* : String
  - *alt* : String
- *headerText* : String
- *subhead* : String
- *selected* : Boolean, define if card is selected or not (default to false)
- *onDoubleClick*: Function
- *onClick*: Function


### Examples

#### Selectable

```jsx
<Card
    image={{src: 'http://placekitten.com/g/200/300', alt: 'Beautiful hairy pussy'}}
    headerText="Beautiful_hairy_pussy.jpg"
    subhead="Jpeg - 1200x1800px - 1.2mb"
    selected
    onDoubleClick={() => console.log('Image double clicked')}
    onClick={() => console.log('Image clicked')}
    />
```
