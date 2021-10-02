const database = require('../database');


module.exports.upload = [
    database.addData(),
    (req, res, next) => {
        const resContent = JSON.stringify({id: res.id})
        res.statusCode = 201;
        res.send(resContent);
        next();
    }
];