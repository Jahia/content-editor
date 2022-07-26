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
}

const contentTypes: ContentTypes = {
    contentReference: {
        typeName: 'Content reference',
        fieldNodeType: 'jnt:contentReference_j:node',
    },
    fileReference: {
        typeName: 'File reference',
        fieldNodeType: 'jnt:fileReference_j:node',
    },
    imageReference: {
        typeName: 'Image (from the Document Manager)',
        fieldNodeType: 'jnt:imageReferenceLink_j:node',
    },
}

export { contentTypes, ContentType }
