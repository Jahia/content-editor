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

export const resolveQueryConstraints = (pickerConfig, mode) => {
    const obj = {
        type: mode.replace('picker-', ''),
        selectableTypesTable: pickerConfig.selectableTypesTable,
        typeFilter: {
            pages: [],
            content: [],
            media: []
        }
    };

    // Note that when in 'contents' there is no pages tab at all as per design of content table in jcontent
    if (mode === 'picker-pages' || mode === 'picker-content-folders') {
        obj.typeFilter.pages = ['jnt:page'];
        obj.typeFilter.content = pickerConfig.selectableTypesTable.filter(t => t !== 'jnt:page');
    } else if (mode === 'picker-media') {
        obj.typeFilter.media = [...pickerConfig.selectableTypesTable];
        obj.typeFilter.media.push('jnt:folder');
    }

    return obj;
};
