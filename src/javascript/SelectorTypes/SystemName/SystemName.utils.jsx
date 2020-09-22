export const limitSystemNameIfNecessary = (currentValue, field) => {
    const maxLength = field.selectorOptions.find(option => option.name === 'maxLength')?.value;
    return maxLength ? currentValue?.substring(0, maxLength) : currentValue;
};

const mapSpecialCharacter = {
    é: 'e',
    è: 'e',
    ë: 'e',
    Ê: 'e',
    Ë: 'e',
    '€': 'e',
    '§': 'ss',
    ç: 'c',
    Ç: 'c',
    '¢': 'c',
    ù: 'u',
    Ù: 'u',
    Û: 'u',
    à: 'a',
    Å: 'a',
    å: 'a',
    Á: 'a',
    ª: 'a',
    '¶': 'p',
    ø: 'o',
    ô: 'o',
    Ô: 'o',
    Ø: 'o',
    Ó: 'o',
    '°': 'd',
    '£': 'ps',
    '™': 'tm',
    Ÿ: 'y',
    '¥': 'y',
    '‰': '0',
    î: 'i',
    ï: 'i',
    Î: 'i',
    Í: 'i',
    Œ: 'oe',
    Æ: 'ae'
};

export const replaceSpecialCharacters = systemName => {
    const newSystemName = systemName?.replace(/[^A-Z0-9-_,()'!]/ig, character => {
        return mapSpecialCharacter[character] || '-';
    });

    return newSystemName?.replace(/-+/g, () => {
        return '-';
    });
};
