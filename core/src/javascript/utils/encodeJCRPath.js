export function encodeJCRPath(path) {
    return path.split('/').map(entry => encodeURIComponent(entry)).join('/');
}
