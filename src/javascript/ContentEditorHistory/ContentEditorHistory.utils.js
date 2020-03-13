export function splitPath(currentPath) {
    const [,, currentLanguage, currentMode, currentUuid, ...rest] = currentPath.split('/');
    const currentRest = rest.length > 0 ? ['', ...rest].join('/') : '';
    return {currentLanguage, currentMode, currentUuid, currentRest};
}
