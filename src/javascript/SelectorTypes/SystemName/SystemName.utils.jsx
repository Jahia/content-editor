export const limitSystemNameIfNecessary = (currentValue, field) => {
    const maxLength = field.selectorOptions.find(option => option.name === 'maxLength')?.value;
    return maxLength ? currentValue?.substring(0, maxLength) : currentValue;
};

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

export const replaceSpecialCharacters = systemName => {
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
            .replace(/-$/, '');
    }
};

export const isEqualToSystemName = (title, systemName, field) => {
    return limitSystemNameIfNecessary(replaceSpecialCharacters(title), field) === systemName;
};
