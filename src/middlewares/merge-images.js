const {replaceBackground} = require('backrem');
const database = require('../database');


module.exports.mergeImages = (req, res) => {
    const parameters = req.query;
    const {front: frontId, back: backId, color, threshold} = parameters;
    const rgb = color.split(',').map(item => Number(item));

    const frontData = database.getDataById(frontId);
    const backData = database.getDataById(backId);

    res.contentType(frontData.type);

    replaceBackground(frontData.stream, backData.stream, rgb, threshold).then(
        readableStream => {
            readableStream.pipe(res);
        }
    ).catch(() => {
        res.statusCode = 400;
        res.contentType('text/html');
        res.send('Target image size should be equal to background image size.');
    });
};