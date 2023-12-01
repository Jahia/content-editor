
export const formatInitialSelectedItem = value => {
    if (!value) {
        return [{}];
    }

    if (typeof value === 'string') {
        return [{path: value}];
    }

    if (Array.isArray(value)) {
        return value.map(item => {
            if (typeof item === 'string') {
                return {path: value};
            }

            return item;
        });
    }
};
