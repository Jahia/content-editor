
/**
 * This function get the full name of a language by his id
 *
 * @param languages list of available languages
 * @param id language id to get
 */
export function getFullLanguageName(languages, id) {
    return languages.find(language =>
        language.language === id
    ).displayName;
}
