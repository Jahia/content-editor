export function splitPath(currentPath) {
    const [, appName, currentLanguage, currentMode, currentUuid, ...rest] = currentPath.split('/');
    const currentRest = rest.length > 0 ? ['', ...rest].join('/') : '';
    return {appName, currentLanguage, currentMode, currentUuid, currentRest};
}
