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
			if (result.length==0) {
				throw "No Primary key found!";
			}
			callback(result[0].Column_name)
        });
    }

    // returns all tables from a database as an array ['table1', 'table2']
    getAllTables(database, callback) {
        this.query("SELECT table_name FROM information_schema.tables WHERE table_schema = ?", function (result) {
            var tables = [];
			for(var i=0; i < result.length; i++){
				tables.push(result[i].table_name);
			}
            callback(tables);
        }, database);
    }

    // returns all columns from a table as an array ['column1', 'column2']
    getAllColumns(table, callback) {
			this.query("show columns from " + table, function (result) {
			var columns = [];
			for(var i=0;i<result.length;i++){
				columns.push(result[i].Field);
			}
            callback(columns);
        }, table);
    }
	getAllIndex(table, callback) {
		this.query(`select table_name, non_unique, group_concat(column_name order by seq_in_index) as index_columns 
					from information_schema.statistics where table_schema not in ('information_schema', 'mysql', 'performance_schema', 'sys') 
					AND TABLE_NAME=` + table + `GROUP BY table_name,non_unique")`, 
			function (result) {
				callback(result.index_columns);
			})
	}
}


exports.DB = DB