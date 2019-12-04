
export const adaptToCategoryTree = ({nodes, parent, selectedValues}) => {
    return nodes
        .filter(category => category.parent.uuid === parent.uuid)
        .map(category => {
            return {
                label: category.displayName,
                uuid: category.uuid,
                checked: selectedValues ? selectedValues.includes(category.uuid) : undefined,
                children: adaptToCategoryTree({
                    nodes,
                    parent: category,
                    selectedValues
                })
            };
        });
};
