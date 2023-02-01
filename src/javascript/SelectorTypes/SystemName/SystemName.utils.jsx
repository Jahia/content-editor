import charmap from './charmap.json';

export const replaceSpecialCharacters = (systemName, field) => {
    const maxLength = field?.selectorOptions?.find(option => option.name === 'maxLength')?.value;
    if (systemName) {
        return systemName
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\-]/ig, character => {
                return charmap[character] || '-';
            })
            .replace(/-+/g, '-')
            .replace(/^-/, '')
            .substring(0, maxLength)
            .replace(/-$/, '');
    }
};

export const isEqualToSystemName = (title, systemName, field) => {
    return replaceSpecialCharacters(title, field) === systemName;
};
