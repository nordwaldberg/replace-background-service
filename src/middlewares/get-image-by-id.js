const database = require('../database');


module.exports.getImageById = (req, res) => {
    const fileData = database.getDataById(req.params.id);

    res.contentType(fileData.type);
    fileData.stream.pipe(res);
}