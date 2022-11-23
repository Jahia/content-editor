export const cutStringInTheMiddle = (string, keepAtStart, keepAtEnd, ellipsis) => {
    const maxLength = keepAtStart + keepAtEnd + ellipsis.length;
    if (string.length <= maxLength) {
        return string;
    }

    return string.slice(0, keepAtStart) + ellipsis + string.slice(string.length - keepAtEnd);
};
