const mysql = require('mysql');
const config = require('config');

class DB {
    constructor() {
        const dbConfig = config.get('dbConfig');
        this.connection = mysql.createConnection(dbConfig);
        this.connection.connect();
    }

    // call example: query("SELECT * FROM table WHERE aaa = :aaa AND bbb = :bbb",{ aaa: aaa, bbb: bbb })
    async query(query, params = []) {
        return await new Promise((resolve, reject) => {
            this.connection.query(query, params, function(error, results, fields){
                if (error) throw error;
                resolve(results)
            })
        })
    }

    end() {
        this.connection.end();
    }

    // returns the name of the primary column from a given table
    async getPrimary(table) {
        const result = await this.query("SHOW KEYS FROM " + table + " WHERE Key_name = 'PRIMARY'")
        if (result.length==0) {
            throw "No Primary key found!";
        }
        return result[0].Column_name
    }

    // returns all tables from a database as an array ['table1', 'table2']
    async getAllTables() {
        let database = config.get('dbConfig.database')
        const result = await this.query("SELECT table_name FROM information_schema.tables WHERE table_schema = ?", database)
        var tables = []
        for (var i=0; i < result.length; i++) {
            tables.push(result[i].table_name)
        }
        return tables
    }

    // returns all columns from a table as an array ['column1', 'column2']
    async getAllColumns(tableName) {
        const result = await this.query("show columns from " + tableName)
        var columns = []
        for (var i=0; i < result.length; i++) {
            columns.push(result[i].Field)
        }
        return columns
    }
	
    async getAllIndex(tableName) {
        const result = await this.query(`select table_name, non_unique, group_concat(column_name order by seq_in_index) as index_columns 
                from information_schema.statistics where table_schema not in ('information_schema', 'mysql', 'performance_schema', 'sys') 
                AND TABLE_NAME=` + tableName + `GROUP BY table_name,non_unique")`)
        return result.index_columns
	}
}


exports.DB = DB