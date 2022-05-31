export const adaptToCategoryTree = ({nodes, parent, selectedValues, locale}) => {

    // This is only to raise the issue, you will most likely want to fix it somewhere else and do something nicer as well.
    // localeCompare in JS expect a locale like en-US NOT en_US which Jahia uses.
    if (locale.indexOf("_") !== -1) {
        locale = locale.replace("_", "-");
    }

    return nodes
        .filter(category => category.parent.uuid === parent.uuid)
        .map(category => {
            return {
                ...category,
                expanded: nodes.filter(cat => cat.parent.uuid === category.uuid).filter(cat => selectedValues && selectedValues.includes(cat.uuid)).length > 0,
                checked: selectedValues ? selectedValues.includes(category.uuid) : undefined,
                children: adaptToCategoryTree({
                    nodes,
                    locale,
                    parent: category,
                    selectedValues
                }).sort((c1, c2) => c1.label.localeCompare(c2.label, locale))
            };
        });
};
