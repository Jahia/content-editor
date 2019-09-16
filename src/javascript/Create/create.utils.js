export const nodeTypeFormatter = name =>
    name.substr(name.indexOf(':') + 1)
        .split('')
        .reduce(
            (acc, char) => {
                const charCode = char.charCodeAt();
                const currentChar = acc.length > 0 && charCode < 91 && charCode > 64 ? ('-' + String.fromCharCode(charCode + 32)) : char;
                return acc + currentChar;
            }, '');
