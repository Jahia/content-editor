let path = require('path');
let md5 = require('md5');
let fs = require('fs');

module.exports = function () {
    const res = {};
    try {
        const s = path.join(process.cwd(), './src/main/resources/javascript/locales');
        const files = fs.readdirSync(s);
        files.forEach(file => {
            res[file] = md5(fs.readFileSync(path.join(s, file)));
        });
    } catch (e) {
        console.error('Cannot read locales files', e);
    }

    return 'module.exports = ' + JSON.stringify(res);
};
