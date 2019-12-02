
export const adaptToCategoryTree = ({nodes, parent}) => {
    return nodes
        .filter(category => category.parent.name === parent.name)
        .map(category => {
            return {
                label: category.displayName,
                name: category.name,
                children: adaptToCategoryTree({
                    nodes,
                    parent: category
                })
            };
        });
};
