const database = require('../database');

module.exports.getWholeList = (req, res) => {
    const list = database.getAllData();

    res.contentType('application/json');
    res.send(list);
};