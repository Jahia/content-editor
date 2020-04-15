// TODO: BACKLOG-13219 adapt this when fetching the data, not here, it's too late.
export const buildFlatFieldObject = field => {
    if (!field.selectorOptions) {
        return field;
    }

    const selectorOptions = field.selectorOptions ?
        field.selectorOptions.reduce((acc, option) => {
            return {
                ...acc,
                [option.name]: option.value
            };
        }, {}) :
        {};

    return {
        ...field,
        selectorOptions
    };
};
