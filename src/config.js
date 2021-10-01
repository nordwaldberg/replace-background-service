const path = require('path');

const databaseFolder = path.resolve(__dirname, '../database');
const dump = path.resolve(databaseFolder, 'dump.json');
const images = path.resolve(databaseFolder, 'images');

module.exports = {
    databaseFolder,
    dump,
    images,
};