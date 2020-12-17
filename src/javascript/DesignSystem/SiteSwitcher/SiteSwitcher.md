## SiteSwitcher Component

This component displays button to allow switching to another site.

### Props

-   _id_:           string value for component id
-   _site_:      string of node site key
-   _siteNodes_:    array of objects contains site nodes
-   _onSelectSite_: function to select site node

All props is required to use this component

### Example

```jsx
const siteNodes = [] 
const siteKey = 'siteKey' 

<SiteSwitcher
    id="site-switcher"
    siteKey={siteKey}
    siteNodes={siteNodes}
    onSelectSite={onSelectSite()}
/>
```
