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
