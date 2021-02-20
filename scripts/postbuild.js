const fs = require('fs');
const path = require('path');

fs.rename(path.resolve(__dirname, '../build/index.html'), path.resolve(__dirname, '../build/webapp.html'), function (err) {
    if (err) throw err;
});