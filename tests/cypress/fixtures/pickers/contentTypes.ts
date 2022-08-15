interface ContentTypes {
    [key: string]: ContentType
}

/*
 *  - typeName: Content type to search for when adding content; case sensitive
 *  - fieldNodeType: content type field to open picker with; corresponds with 'data-sel-content-editor-field' attr
 */
interface ContentType {
    typeName: string
    fieldNodeType: string
    multiple: boolean
}

const contentTypes: ContentTypes = {
    contentReference: {
        typeName: 'Content reference',
        fieldNodeType: 'jnt:contentReference_j:node',
        multiple: false
    },
    fileReference: {
        typeName: 'File reference',
        fieldNodeType: 'jnt:fileReference_j:node',
        multiple: false
    },
    imageReference: {
        typeName: 'Image (from the Document Manager)',
        fieldNodeType: 'jnt:imageReferenceLink_j:node',
        multiple: false
    },
    // from qa-module
    fileMultipleReference: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_imagepicker',
        multiple: true
    },
}

export { contentTypes, ContentType }
