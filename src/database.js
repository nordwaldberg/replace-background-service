const { EventEmitter } = require('events');
const { existsSync, writeFile, readFileSync } = require('fs');
const { dump } = require('./config.js');

const databaseSize = 100;

class Database extends EventEmitter {
    constructor() {
        super();
        this.data = [];

        if (existsSync(dump)) {
            const currentDumpJSON = readFileSync(dump, 'utf8');
            const currentDump = JSON.parse(currentDumpJSON);

            if (Array.isArray(currentDump.data)) {
                currentDump.data.forEach(elem => this.data.push(elem));
            }
        }
    };

    addData(data) {
        const currDatabaseSize = this.data.length;

        if (currDatabaseSize < databaseSize) {
            this.data.push(data);
        } else {
            this.data = [];
            this.data.push(data);
        }

        this.emit('changed');
    };

    deleteData(index) {
        this.data.splice(index, 1);

        this.emit('changed');
    }

    getAllData() {
        return JSON.stringify(this.data);
    }
};

const database = new Database();

database.on('changed', () => {
    const databaseJSON = JSON.stringify(database, null, '\t');
    writeFile(dump, databaseJSON, 'utf8', () => {});
});

module.exports = database;