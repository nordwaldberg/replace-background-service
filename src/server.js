const express = require('express');
const {upload} = require('./middlewares/upload');
const {getWholeList} = require('./middlewares/get-whole-list');
const {getImageById} = require('./middlewares/get-image-by-id');
const {deleteImageById} = require('./middlewares/delete-image-by-id');
const {mergeImages} = require('./middlewares/merge-images');


const server = express();
const port = process.env.PORT;

server.get('/list', getWholeList);
server.get('/image/:id', getImageById);
server.get(`/merge`, mergeImages);
server.post('/upload', upload);
server.delete('/image/:id', deleteImageById);

server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});