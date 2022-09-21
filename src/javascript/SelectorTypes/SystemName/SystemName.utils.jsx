const mapSpecialCharacter = {
    '€': 'e',
    '§': 'ss',
    '¢': 'c',
    ª: 'a',
    '¶': 'p',
    ø: 'o',
    '°': 'd',
    '£': 'ps',
    '™': 'tm',
    '¥': 'y',
    '‰': '0',
    œ: 'oe',
    æ: 'ae'
};

export const replaceSpecialCharacters = (systemName, field) => {
    const maxLength = field?.selectorOptions?.find(option => option.name === 'maxLength')?.value;
    if (systemName) {
        return systemName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^A-Z0-9-_,()!]/ig, character => {
                return mapSpecialCharacter[character] || '-';
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
