const mysql = require('mysql');
const config = require('config');

class DB {
    constructor() {
        const dbConfig = config.get('dbConfig');
        this.connection = mysql.createConnection(dbConfig);
        this.connection.connect();
    }

    // call example: query("SELECT * FROM table WHERE aaa = :aaa AND bbb = :bbb",{ aaa: aaa, bbb: bbb })
    query(query, callback, params = []) {
        this.connection.query(query, params, function(error, results, fields){
            if (error) throw error;
            callback(results)
        });
    }

    end() {
        this.connection.end();
    }

    // returns the name of the primary column from a given table
    getPrimary(table, callback) {
        this.query("SHOW KEYS FROM " + table + " WHERE Key_name = 'PRIMARY'", function (result) {
            callback(result[0].Column_name)
        });
    }

    // returns all tables from a database as an array ['table1', 'table2']
    getAllTables(database, callback) {
        this.query("SELECT table_name FROM information_schema.tables WHERE table_schema = ?", function (result) {
            callback(result)
        }, database);
    }

    // returns all columns from a table as an array ['column1', 'column2']
    getAllColumns(table, callback) {
        this.query("show columns from " + table, function (result) {
            callback(result)
        }, table);
    }
}


exports.DB = DB