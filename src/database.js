const {EventEmitter} = require('events');
const {existsSync, writeFile, readFileSync} = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');
const multer = require('multer');
const {dumpFilePath, imagesDirPath} = require('./config');
const fs = require('fs');


const databaseSize = 100;

class Database extends EventEmitter {
    constructor() {
        super();
        this.data = [];

        if (existsSync(dumpFilePath)) {
            const currentDumpJSON = readFileSync(dumpFilePath, 'utf8');
            const currentDump = JSON.parse(currentDumpJSON);

            if (Array.isArray(currentDump.data)) {
                currentDump.data.forEach(elem => this.data.push(elem));
            }
        }

        this._storage = multer.diskStorage({
            destination(req, file, cb) {
                cb(null, imagesDirPath);
            },
            filename(req, file, cb) {
                cb(null, file.originalname);
            },
        });
    };

    addData() {
        return [
            multer({storage: this._storage}).single('image'),
            (req, res, next) => {
                if (this.data.length >= databaseSize) {
                    this.data = [];
                }

                const fileRepresentation = new FileRepresentation(req.file);
                this.data.push(fileRepresentation);
                res.id = fileRepresentation.id;

                this.emit('changed');
                next();
            }
        ]
    };

    deleteData() {
        return [
            (req, res, next) => {
                // TODO delete from disk
                next();
            },
            (req, res, next) => {
                this.data.splice(this._getDataIndexById(req.params.id), 1);

                this.emit('changed');
                next();
            }
        ]

    }

    getAllData() {
        return JSON.stringify(this.data);
    }

    getDataById(id) {
        const dataRepresentation = this.data.find(item => item.id === id);

        return {
            ...dataRepresentation,
            stream: fs.createReadStream(path.resolve(imagesDirPath, dataRepresentation.name)),
        }
    }

    _getDataIndexById(id) {
        return this.data.findIndex(item => item.id === id);
    }
};

class FileRepresentation {
    constructor({size, originalname, mimetype}) {
        this.id = uuidv4();
        this.size = size;
        this.creationDate = new Date();
        this.name = originalname;
        this.type = mimetype;
    }
};

const database = new Database();

database.on('changed', () => {
    const databaseJSON = JSON.stringify(database, null, '\t');
    writeFile(dumpFilePath, databaseJSON, 'utf8', () => {
    });
});

module.exports = database;