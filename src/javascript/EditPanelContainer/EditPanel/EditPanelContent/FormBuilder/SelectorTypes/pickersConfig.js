import MediaPicker from './MediaPicker';
import ContentPicker from './ContentPicker';

const treeConfig = {
    content: {
        rootPath: '/contents',
        openableTypes: ['jnt:contentFolder'],
        selectableTypes: ['jnt:contentFolder'],
        type: 'contents',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'
    },
    allContents: {
        rootPath: '/',
        openableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        selectableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        type: 'allContents',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.allContentsRootLabel'
    },
    files: {
        rootPath: '/files',
        openableTypes: ['nt:folder'],
        selectableTypes: ['nt:folder'],
        type: 'files',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'
    },
    pages: {
        rootPath: '/',
        openableTypes: ['jnt:page', 'jnt:virtualsite', 'jnt:navMenuText'],
        selectableTypes: ['jnt:page'],
        type: 'pages',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.pagesRootLabel'
    }
};

const _getPickerType = options => {
    const option = options && options.find(option => option.name === 'type' && pickersConfig[option.value]);
    return (option && option.value) || 'editorial';
};

const pickersConfig = {
    image: {
        picker: MediaPicker,
        treeConfigs: [treeConfig.files],
        selectableTypesTable: ['jmix:image']
    },
    folder: {
        picker: ContentPicker,
        treeConfigs: [treeConfig.files],
        selectableTypesTable: ['nt:folder']
    },
    contentfolder: {
        treeConfigs: [treeConfig.content],
        picker: ContentPicker,
        selectableTypesTable: ['jnt:contentFolder']
    },
    page: {
        picker: ContentPicker,
        treeConfigs: [treeConfig.pages],
        selectableTypesTable: ['jnt:page']
    },
    editorial: {
        picker: ContentPicker,
        treeConfigs: [treeConfig.allContents],
        selectableTypesTable: ['jnt:page', 'jmix:editorialContent', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent']
    },
    /* Todo: Editoriallink: {

     }, */

    resolveComponent(options) {
        return this[_getPickerType(options)].picker;
    },
    resolveConfig(options, formDefinition) {
        const config = Object.assign({}, this[_getPickerType(options)]);
        if (formDefinition && formDefinition.valueConstraints) {
            const constraints = formDefinition.valueConstraints.map(constraint => constraint.value.string);
            if (constraints && constraints.length > 0) {
                config.selectableTypesTable = constraints;
            }
        }

        return config;
    }
};

export default pickersConfig;
