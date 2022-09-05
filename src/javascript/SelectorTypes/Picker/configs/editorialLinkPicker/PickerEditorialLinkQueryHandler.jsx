import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {PickerBaseQueryHandler, PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';

export const PickerEditorialLinkQueryHandler = {
    ...PickerTreeQueryHandler,
    getQueryVariables: selection => {
        const queryParams = {
            ...PickerBaseQueryHandler.getQueryVariables(selection),
            offset: 0,
            limit: 10000,
            fieldGrouping: null
        };

        if (selection.params.selectableTypesTable.includes('jnt:page') && selection.tableView.viewType === Constants.tableView.type.PAGES) {
            queryParams.typeFilter = ['jnt:page', 'jmix:mainResource'];
            queryParams.recursionTypesFilter = {multi: 'NONE', types: ['jnt:contentFolder']};
        } else { // Content
            queryParams.typeFilter = ['jnt:contentFolder', 'jmix:mainResource'];
            queryParams.recursionTypesFilter = {multi: 'NONE', types: ['jnt:page']};
        }

        return queryParams;
    },
    structureData(parentPath, result) {
        const dataForParentPath = result?.nodes || [];
        const structuredData = dataForParentPath.filter(d => d.parent.path === parentPath);
        setSubrows(structuredData, dataForParentPath);

        // Add orphaned nodes to closest ancestors
        dataForParentPath.forEach(r => {
            if (!r.inTree && r.tableAncestor) {
                r.tableAncestor.subRows.push(r);
            }

            // Clean-up temp attributes
            delete r.inTree;
            delete r.tableAncestor;
        });

        return {
            ...result,
            nodes: structuredData
        };

        // Recursively finds and puts children of data[i] in data[i].subRows
        // Modified to add child nodes under its closest ancestors instead of just direct children
        function setSubrows(dataTree, unstructuredData) {
            for (let i = 0; i < dataTree.length; i++) {
                const data = dataTree[i];
                data.inTree = true;
                data.subRows = [];

                const descendants = [];
                for (let j = 0; j < unstructuredData.length; j++) {
                    const uData = unstructuredData[j];
                    const isChild = uData.parent.path === data.path;
                    const isDescendant = data.path === uData.parent.path.substring(0, data.path.length);
                    if (isChild) {
                        data.subRows.push(uData);
                    } else if (isDescendant) {
                        descendants.push(uData);
                        if (data.path.length > (uData.tableAncestor?.path?.length || 0)) {
                            uData.tableAncestor = data; // Keep track of closest ancestor
                        }
                    }
                }

                setSubrows(data.subRows, descendants);
            }
        }
    },
    isStructured: () => true
};
