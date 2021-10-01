const { v4: uuidv4 } = require('uuid');

class FileData {
    constructor({ size, originalname, mimetype }) {
        this.id = uuidv4();
        this.size = size;
        this.creationDate = new Date();
        this.name = originalname;
        this.type = mimetype;
    }

    getFileInfo() {
        return {
            id: this.id,
            size: this.size,
            creationDate: this.creationDate,
            name: this.name,
            type: this.type,
        }
    }
};

module.exports = FileData;