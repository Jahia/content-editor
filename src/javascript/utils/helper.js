export const truncate = (string, num) => {
    if (string.length <= num) {
        return string;
    }

    return string.slice(0, num) + '...';
};

/**
 * JCR system name doesnt allow this characters: ['/', ':', '[', ']', '|', '*']
 * So we will encode them
 *
 * @param systemName the system name to be encode
 * @returns {*} the encoded system name
 */
export const encodeSystemName = systemName => {
    systemName = systemName.replace(/[/:]/g, '');
    if (systemName && systemName.length > 0) {
        let encodedSystemName = '';
        // First Step: Encode characters using encodeURI js API
        for (let i = 0; i < systemName.length; i++) {
            const charToEncode = systemName.charAt(i);
            encodedSystemName += ['%', '[', ']', '|'].includes(charToEncode) ? encodeURIComponent(charToEncode) : charToEncode;
        }

        // Second step: Special handling of '*' characters that need to be encoded, but it's not encoded by encodeURI js API
        return encodedSystemName.split('*').join('%2A');
    }

    return systemName;
};

export const getCapitalized = name => {
    return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * JCR system name is stored encoded to avoid invalid characters,
 * we need to decode it before display, see @encodeSystemName for encoding specs
 *
 * @param systemName the system name to be decode
 * @returns {*} the decoded system name
 */
export const decodeSystemName = systemName => {
    if (systemName && systemName.length > 0) {
        // First step: Special decoding for '*' character
        const decodedSystemName = systemName.split('%2A').join('*');

        // Second step: Decode using js API
        return decodeURIComponent(decodedSystemName);
    }

    return systemName;
};
