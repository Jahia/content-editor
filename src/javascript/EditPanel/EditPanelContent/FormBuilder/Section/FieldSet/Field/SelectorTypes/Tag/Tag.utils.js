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

    // We receive from the adaptation of the selection a set of tags, so we should destructure the options in
    // the array to iterate through it.
    return [...adaptedSelection];
};
