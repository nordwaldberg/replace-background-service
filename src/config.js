const path = require('path');


const databaseDirPath = path.resolve(__dirname, '../database');
const dumpFilePath = path.resolve(databaseDirPath, 'dump.json');
const imagesDirPath = path.resolve(databaseDirPath, 'images');

module.exports = {
    databaseDirPath,
    dumpFilePath,
    imagesDirPath,
};