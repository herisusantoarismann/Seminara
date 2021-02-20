/* config-overrides.js */

const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appIndexJs = path.resolve(__dirname, 'src/webapp/index.js');
        paths.appSrc = path.resolve(__dirname, 'src/webapp');
        return paths;
    },
}