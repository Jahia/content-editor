export const adaptSelection = (selection, separator) => {
    const adaptedSelection = new Set();

    if (selection) {
        selection.forEach(token => {
            const lowerCaseToken = token.toLowerCase();

            if (lowerCaseToken.includes(separator)) {
                lowerCaseToken
                    .split(separator)
                    .forEach(item => {
                        const element = item.trim();
                        if (element !== '') {
                            adaptedSelection.add(element);
                        }
                    });
            } else {
                adaptedSelection.add(lowerCaseToken);
            }
        });
    }

    return adaptedSelection;
};
