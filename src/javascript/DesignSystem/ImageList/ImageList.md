## Image List Component

This component is the list of image used for example in the media picker


### Variants

- Selectable
- multipleSelectable

### Props

- *error* : An error to display instead of the image list
- *images* : Array of images
  - *uuid*: String
  - *type*: String
  - *name*: String
  - *path*: String
  - *width*: String
  - *height*: String
- *multipleSelectable* : Boolean to define if we can select multiple images
- *onImageDoubleClick* : Function
- *onImageSelection*: Function


### Examples

#### Selectable

```jsx
<ImageList
    images={[
      {uuid: 'abc', type: 'Jpeg', name: 'Beautiful_hairy_pussy.jpg', path: 'http://placekitten.com/g/200/300', width: '1200', height: '1800'},
      {uuid: 'bcd', type: 'Jpeg', name: 'Beautiful_hairy_pussy2.jpg', path: 'http://placekitten.com/g/300/400', width: '1800', height: '1500'}
      ]}
    onImageDoubleClick={imgDoubleClicked => console.log(imgDoubleClicked)}
    onImageSelection={imgsSelected => console.log(imgsSelected)}
    />
```


#### multipleSelectable

```jsx
<ImageList
    images={[
      {uuid: 'abc', type: 'Jpeg', name: 'Beautiful_hairy_pussy.jpg', path: 'http://placekitten.com/g/200/300', width: '1200', height: '1800'},
      {uuid: 'bcd', type: 'Jpeg', name: 'Beautiful_hairy_pussy2.jpg', path: 'http://placekitten.com/g/300/400', width: '1800', height: '1500'}
      ]}
    multipleSelectable={true}
    onImageDoubleClick={imgDoubleClicked => console.log(imgDoubleClicked)}
    onImageSelection={imgsSelected => console.log(imgsSelected)}
    />
```
