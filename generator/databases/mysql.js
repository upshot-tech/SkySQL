const mysql = require('mysql');
const config = require('config');

class Database {
    constructor() {
        const dbConfig = config.get('dbConfig');
        this.connection = mysql.createConnection(dbConfig);
        connection.connect();
    }

    // call example: query("SELECT * FROM table WHERE aaa = :aaa AND bbb = :bbb",{ aaa: aaa, bbb: bbb })
    query(query, params = []) {
        this.connection.query(query, params, function(error, results, fields){
            if (error) throw error;
            return results;
        });
    }

    end() {
        this.connection.end();
    }

    getPrimary() {
        result = this.query("SHOW KEYS FROM table WHERE Key_name = 'PRIMARY'");
        return result[0].Column_name;
    }
}