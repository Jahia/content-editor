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
    // From qa-module
    fileMultipleReference: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_imagepicker',
        multiple: true
    },
    filepicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_filepicker',
        multiple: false
    },
    imagepicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_imagepicker',
        multiple: false
    },
    folderpicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_folderpicker',
        multiple: false
    },
    contentfolderpicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_contentfolderpicker',
        multiple: false
    },
    portletpicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_portletpicker',
        multiple: false
    },
    editorialpicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_editorialpicker',
        multiple: false
    },
    editoriallinkpicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_editoriallinkpicker',
        multiple: false
    },
    categorypicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_categorypicker',
        multiple: false
    },
    sitepicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_sitepicker',
        multiple: false
    },
    userpicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_userpicker',
        multiple: false
    },
    usergrouppicker: {
        typeName: 'Pickers',
        fieldNodeType: 'qant:pickers_usergrouppicker',
        multiple: false
    },
    filepickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_filepicker',
        multiple: false
    },
    imagepickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_imagepicker',
        multiple: false
    },
    folderpickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_folderpicker',
        multiple: false
    },
    contentfolderpickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_contentfolderpicker',
        multiple: false
    },
    portletpickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_portletpicker',
        multiple: false
    },
    editorialpickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_editorialpicker',
        multiple: false
    },
    editoriallinkpickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_editoriallinkpicker',
        multiple: false
    },
    categorypickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_categorypicker',
        multiple: false
    },
    sitepickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_sitepicker',
        multiple: false
    },
    userpickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_userpicker',
        multiple: false
    },
    usergrouppickerMultiple: {
        typeName: 'Pickers Multiple',
        fieldNodeType: 'qant:pickersMultiple_usergrouppicker',
        multiple: false
    },
    customPicker: {
        typeName: 'customPicker',
        fieldNodeType: 'qant:customPicker_myCategoryPicker',
        multiple: false
    },
    pickerWithOverride: {
        typeName: 'customPicker',
        fieldNodeType: 'qant:customPicker_myOverridenEditorialPicker',
        multiple: false
    },
    pageDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_page',
        multiple: false
    },
    contentfolderDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_contentFolder',
        multiple: false
    },
    folderDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_folder',
        multiple: false
    },
    fileDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_file',
        multiple: false
    },
    imageDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_image',
        multiple: false
    },
    editoriallinkDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_editoriallink',
        multiple: false
    },
    userDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_user',
        multiple: false
    },
    usergroupDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_usergroup',
        multiple: false
    },
    siteDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_site',
        multiple: false
    },
    categoryDefault: {
        typeName: 'pickersDefault',
        fieldNodeType: 'qant:pickersDefault_category',
        multiple: false
    }
};

export {contentTypes, ContentType};
