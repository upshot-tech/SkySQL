const { Pool, Client } = require('pg')
const config = require('config');

class MySQL {
    constructor() {
        const dbConfig = config.get('dbConfig');
        this.connection = new Client(dbConfig)
        this.connection.connect()
        this.connection.query('SELECT NOW()', (err, res) => {
            console.log(err, res)
            this.connection.end()
        })
    }

    // call example: query("SELECT * FROM table WHERE aaa = :aaa AND bbb = :bbb",{ aaa: aaa, bbb: bbb })
    query(query, callback, params = []) {
        this.connection.query(query, params, (err, res) => {
            console.log(err ? err.stack : res.rows[0].message) // Hello World!
            callback(res)
        })
    }

    end() {
        this.connection.end();
    }

    getPrimary(table, callback) {
        this.query("SHOW KEYS FROM " + table + " WHERE Key_name = 'PRIMARY'", function (result) {
            callback(result[0].Column_name)
        });
    }
}


exports.MySQL = MySQL