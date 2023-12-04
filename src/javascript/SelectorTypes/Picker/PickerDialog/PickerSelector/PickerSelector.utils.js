
export const getInitialSelectedItem = ({initialOption, initialSelectedItem, provider}) => {
    if (provider === 'default') {
        if (initialOption.key === provider) {
            return initialSelectedItem && initialSelectedItem.map(f => f.path);
        }
    } else if (initialOption.key === provider) {
        return initialSelectedItem && initialSelectedItem.map(f => f.uuid);
    }

    return [];
};
