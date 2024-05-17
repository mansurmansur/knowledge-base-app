const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(dbPath) {
        if (Database.instance) {
            return Database.instance;
        }

        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Database initialization error:', err);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });

        Database.instance = this;
    }

    run(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    get(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    all(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Database closing error:', err);
            } else {
                console.log('Disconnected from the SQLite database.');
            }
        });
    }
}

module.exports = Database;
