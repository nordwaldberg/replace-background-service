const express = require('express');
const path = require('path');
const multer  = require('multer');
const fs = require('fs');
const { replaceBackground } = require("backrem");

const { images } = require(path.resolve(__dirname, 'config.js'));
const FileData = require(path.resolve(__dirname, 'file-data.js'));
const database = require(path.resolve(__dirname, 'database.js'));
const { getDataById, getDataIndexById } = require('./helpers');

const store = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve(__dirname, images));
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: store }).single('image');

const server = express();
const port = process.env.PORT;

server.get('/list', (req, res) => {
    const list = database.getAllData();
    res.contentType('application/json');
    res.send(list);
});

server.get('/image/:id', (req, res) => {
    const id = req.params.id;
    const data = getDataById(id, database);
    const filename = data.name;
    const contentType = data.type;

    const filepath = path.resolve(__dirname, `${images}/${filename}`);
    const fileStream = fs.createReadStream(filepath);

    res.contentType(contentType);
    fileStream.pipe(res);
});

server.get(`/merge`, (req, res) => {
    const parameters = req.query;

    const frontData = getDataById(parameters.front, database);
    const backData = getDataById(parameters.back, database);

    const frontName = frontData.name;
    const backName = backData.name;

    const frontImagePath = path.resolve(__dirname, `${images}/${frontName}`);
    const backImagePath = path.resolve(__dirname, `${images}/${backName}`);

    const front = fs.createReadStream(
        path.resolve(__dirname, frontImagePath)
    );

    const back = fs.createReadStream(
        path.resolve(__dirname, backImagePath)
    );

    const rgb = [];
    parameters.color.split(',').forEach(item => rgb.push(Number(item)));

    const threshold = parameters.threshold;

    res.contentType(frontData.type);

    replaceBackground(front, back, rgb, threshold).then(
        readableStream => {
            readableStream.pipe(res);
        }
    ).catch(error => {
        res.statusCode = 400;
        res.contentType('text/plain');
        res.send('Target image size should be equal to background image size.');
    });
});

server.post('/upload', upload, (req, res) => {
    const image = new FileData(req.file);
    const imageData = image.getFileInfo();

    database.addData(imageData);
    const resContent = JSON.stringify({ id : imageData.id })
    res.statusCode = 201;
    res.send(resContent);
});

server.delete('/image/:id', (req, res) => {
    const id = req.params.id;
    const dataIndex = getDataIndexById(id, database);

    database.deleteData(dataIndex);

    res.statusCode = 200;
    res.contentType('application/json');
    const resContent = JSON.stringify({ id : id });
    res.send(resContent);
});

server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});