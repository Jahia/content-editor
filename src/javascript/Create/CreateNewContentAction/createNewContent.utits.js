import {getTreeOfContent} from '~/Create/CreateNewContentAction/CreateNewContent.gql-queries';

export async function getActions(context, variables) {
    const {data} = await context.client.query({
        query: getTreeOfContent,
        variables
    });

    const nodeTypes = data.forms.contentTypesAsTree
        .map(category => {
            if (category.children && category.children.length > 0) {
                return category.children;
            }

            return [category];
        })
        .reduce((sum, types) => {
            types.forEach(type => sum.push(type));
            return sum;
        }, []);

    if (nodeTypes.length <= 3) {
        return nodeTypes.map(nodeType => ({
            key: nodeType.name + '-beta',
            openEditor: true,
            nodeTypes: [nodeType.name],
            buttonLabel: 'content-editor:label.contentEditor.CMMActions.createNewContent.contentOfType',
            buttonLabelParams: {typeName: nodeType.label}
        }));
    }
}

export const filterTree = (tree, selectedType, filter) => tree
    .map(category => {
        const filteredNodes = filter ? category.children.filter(node => {
            return node.name.toLowerCase().includes(filter) || node.label.toLowerCase().includes(filter);
        }) : category.children;

        // Never close selected content category
        const isCategorySelected = selectedType ? category.id === selectedType.parent.id : null;

        return {
            ...category,
            opened: filter ? true : (category.opened || isCategorySelected),
            children: filteredNodes.map(node => {
                return {
                    ...node,
                    selected: isCategorySelected && selectedType.id === node.id
                };
            })
        };
    })
    .filter(category => {
        return category.children === undefined || category.children.length !== 0;
    });
