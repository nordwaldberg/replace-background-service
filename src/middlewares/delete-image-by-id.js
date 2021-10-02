const database = require('../database');


module.exports.deleteImageById = [
    database.deleteData(),
    (req, res) => {
        res.statusCode = 200;
        res.contentType('application/json');
        const resContent = JSON.stringify({id: req.params.id});
        res.send(resContent);
    },
];