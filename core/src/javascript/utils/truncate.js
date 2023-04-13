export const truncate = (string, num) => {
    if (string.length <= num) {
        return string;
    }

    return string.slice(0, num) + '...';
};

