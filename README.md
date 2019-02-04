content-editor
==============
[dx-image][dx-url]

Content Editor React extension for DX modules.

### Requirements
- https://github.com/Jahia/dx-commons-webpack that will provide the shared library https://github.com/Jahia/javascript-components
- branch BACKLOG-9446 of content-media-manager
https://github.com/Jahia/content-media-manager/tree/BACKLOG-9446
### How to install
Currently the only integrati    on of the extension is in the Content and Media manager
- download, build and install [dx-commons-webpack](https://github.com/Jahia/dx-commons-webpack)
- download, build and install [CMM (BACKLOG-9446 branch)](https://github.com/Jahia/content-media-manager/tree/BACKLOG-9446)

Update CMM to integrate the extension:
Add `/modules/content-editor/javascript/apps/content-editor.bundle.js` in `bootstrap` of [template.content-manager.jsp](https://github.com/Jahia/content-media-manager/blob/BACKLOG-9446/src/main/resources/jnt_template/html/template.content-manager.jsp#L52 )
```  
bootstrap(['/modules/content-media-manager/javascript/apps/cmm.bundle.js', '/modules/content-editor/javascript/apps/content-editor.bundle.js']);
```

[dx-image]: https://img.shields.io/badge/DX-7.3.0.0-blue.svg
[dx-url]: https://www.jahia.com
