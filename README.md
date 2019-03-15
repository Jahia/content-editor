content-editor
==============
[![DX version][dx-image]][dx-url]

Content Editor React extension for DX modules.

### Requirements
- the `qa-module` from https://github.com/Jahia/QA-Modules
- https://github.com/Jahia/dx-commons-webpack that will provide the shared library https://github.com/Jahia/javascript-components
- https://github.com/Jahia/content-media-manager
### How to install

- download, build and install [qa-module](https://github.com/Jahia/QA-Modules) . Only the `qa-module` subproject is needed.
- download, build and install [dx-commons-webpack](https://github.com/Jahia/dx-commons-webpack)
- download, build and install [content-media-manager](https://github.com/Jahia/content-media-manager/tree)
- build and install this module

[dx-image]: https://img.shields.io/badge/DX-7.3.0.0-blue.svg
[dx-url]: https://www.jahia.com

### Form generation

The content editor module has a GraphQL API to generate forms for content editing.
This API is exposed under the "forms" field in the GraphQL Query object type.

The generation of the form is done using the following algorithm.

For a given nodeType:

- If a CND definition existing in the JCR, it is used to generate a form definition dynamically.
- If DX modules define static forms that either override or define new forms, they will be merged in order of priority
with first the dynamically generated forms from the JCR definition (if it exists) and then with the static JSON form 
definitions that have a higher priority.

#### GraphQL API

Here's an example of a GraphQL query to generate a form for an existing node:

    {
      forms {
        formByNodeType(nodeType: "qant:allFields", locale: "en", nodeIdOrPath: "e4809aae-6df1-4566-8d76-9fdfb97f258a") {
          nodeType
          fields {
            name
            selectorType
            i18n
            readOnly
            multiple
            mandatory
            values {
              displayValue
              value
              propertyList {
                name
                value
              }
            }
            defaultValue
            targets {
              name
              rank
            }
          }
        }
      }
    }

The result will look something like this (truncated for length) : 

    {
      "data": {
        "forms": {
          "formByNodeType": {
            "nodeType": "qant:allFields",
            "fields": [
              {
                "name": "sharedSmallText",
                "selectorType": "Text",
                "i18n": false,
                "readOnly": false,
                "multiple": false,
                "mandatory": false,
                "values": [],
                "defaultValue": null,
                "targets": [
                  {
                    "name": "content",
                    "rank": 0
                  }
                ]
              },
              {
                "name": "smallText",
                "selectorType": "Text",
                "i18n": true,
                "readOnly": false,
                "multiple": false,
                "mandatory": false,
                "values": [],
                "defaultValue": null,
                "targets": [
                  {
                    "name": "content",
                    "rank": 1
                  }
                ]
              },



#### Defining static forms in DX modules

A DX Module can define static forms by adding JSON files in the META-INF/dx-content-editor-forms directory. The files 
should have a meaning full name, for example for the qant:allFields node type we recommend replacing the colon (:) by an 
underscore so that the file name become qant_allFields.json.

Here's an example of a JSON static form definition coming from this [example module](https://github.com/Jahia/content-editor-formdef-test-module): 

    {
      "nodeType": "qant:allFields",
      "priority": 0.5,
      "fields": [
        {
          "name": "sharedSmallText",
          "selectorType": "SmallText"
        },
        {
          "name": "smallText",
          "removed": true,
          "targets": [{ "name" : "content" }]
        },
        {
          "name" : "sharedTextArea",
          "targets": [{ "name" : "content", "rank" : 1.0 }]
        },
        {
          "name": "customField",
          "selectorType": "Text",
          "i18n": true,
          "readOnly": false,
          "multiple": true,
          "mandatory": true,
          "values": [
            "value1",
            "value2",
            "value3"
          ],
          "defaultValue": "value1",
          "targets": [{ "name": "content", "rank" : -1.0 }]
        },
        {
          "name": "jcr:lastModifiedBy",
          "removed": true,
          "targets": [{"name" : "metadata"}]
        }
      ]
    } 
    
There are some rules for the merging of the field properties. Basically the following cases may apply to a given property:
- case 1 : the property can always be overriden 
- case 2 : the property can only be overridden if its value is not true
- case 3 : the property can only be overridden if its value is not defined

Here are the association between cases and field properties:

| property      | case 1 | case 2 | case 3 |
| :------------ | :----: | :----: | :----: |
| selectorType  | x      |        |        |
| i18n          |        |        | x      |
| readOnly      |        | x      |        |
| multiple      |        |        | x      |
| mandatory     |        | x      |        |
| values        | x      |        |        |
| defaultValue  | x      |        |        |
| targets       | x      |        |        |
| removed       | x      |        |        |

As you can see these overrides will be done in order of priority so it is very important to remember that if you have 
multiple modules overriding the same node type (although this is not recommended but can be useful)

The `removed` property is a special one, which will actually remove a property from the resulting form definition.

#### Selector types

The selectorType property in a form field definition is used to define the UI component that will be used to edit the
field value. It is therefore very useful to set this value according to the needs of the project to build form UIs that 
are easy to use for end-users. In the (near) future it will also be possible to add new selector types in DX modules,
making the form UI expandable.
        