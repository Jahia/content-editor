import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';

export const structureData = function (parentPath, dataForParentPath = []) {
    const structuredData = dataForParentPath.filter(d => d.parent.path === parentPath);
    setSubrows(structuredData, dataForParentPath);
    return structuredData;

    // Recursively finds and puts children of data[i] in data[i].subRows
    function setSubrows(data, unstructuredData) {
        for (let i = 0; i < data.length; i++) {
            data[i].subRows = [];
            const rest = [];
            for (let j = 0; j < unstructuredData.length; j++) {
                if (data[i].path === unstructuredData[j].parent.path) {
                    data[i].subRows.push(unstructuredData[j]);
                } else {
                    rest.push(unstructuredData[j]);
                }
            }

            setSubrows(data[i].subRows, rest);
        }
    }
};

export const resolveQueryConstraints = (pickerConfig, mode, tableViewType, searchTerm, path, searchContext) => {
    const obj = {
        selectableTypesTable: pickerConfig.selectableTypesTable,
        typeFilter: pickerConfig.selectableTypesTable,
        searchTerms: searchTerm,
        searchPath: searchTerm ? searchContext : path
    };

    // Note that when in 'content-folders' there is no pages tab at all as per design of content table in jcontent
    if (mode === 'picker-pages') {
        obj.typeFilter = tableViewType === Constants.tableView.type.PAGES ? ['jnt:page'] : pickerConfig.selectableTypesTable.filter(t => t !== 'jnt:page');
    } else if (mode === 'picker-content-folders') {
        obj.typeFilter = Array.from(new Set([...pickerConfig.selectableTypesTable, 'jnt:contentFolder']));
    } else if (mode === 'picker-media') {
        obj.typeFilter = Array.from(new Set([...pickerConfig.selectableTypesTable, 'jnt:folder']));
    }

    if (searchTerm !== '') {
        obj.nodeType = pickerConfig.searchSelectorType;
    }

    return obj;
};
