export const adaptSelection = (selection, separator) => {
    let adaptedSelection = [];

    if (selection) {
        selection.map(token => {
            if (token.includes(separator)) {
                token
                    .split(separator)
                    .map(item => adaptedSelection.push(item.trim()));
            } else {
                adaptedSelection.push(token);
            }

            return true;
        });
    }

    return adaptedSelection;
};
