const { Pool, Client } = require('pg')
const config = require('config');

class DB {
    constructor() {
        const dbConfig = config.get('dbConfig');
        this.connection = new Client(dbConfig)
        this.connection.connect()
        this.connection.query('SELECT NOW()', (err, result) => {
            if (err !== null) {
                console.log('SQL connection error:')
                console.log(err)
            }
        })
    }

    // call example: query("SELECT * FROM table WHERE aaa = :aaa AND bbb = :bbb",{ aaa: aaa, bbb: bbb })
    query(query, callback, params = []) {
        this.connection.query(query, params, (err, result) => {
            // console.log('SQL result:')
            // console.log(err ? err.stack : result.rows[0]) // Hello World!
            callback(result.rows);
        })
    }

    end() {
        this.connection.end();
    }

    getPrimary(table, callback) {
        this.query(`SELECT kcu.column_name as key_column,
                kcu.ordinal_position as position
            FROM information_schema.table_constraints tco
            JOIN information_schema.key_column_usage kcu 
                on kcu.constraint_name = tco.constraint_name
                and kcu.constraint_schema = tco.constraint_schema
                and kcu.constraint_name = tco.constraint_name
            WHERE tco.constraint_type = 'PRIMARY KEY'
                and kcu.table_name = '` + table + `'
            ORDER BY kcu.table_schema,
                kcu.table_name,
                position;`,
            function (result) {
				if (result.length==0) {
					throw "No Primary key found!";
				}
                callback(result[0].key_column)
            }
        )
    }
	// returns all tables from a database as an array ['table1', 'table2']
    getAllTables(database, callback) {
        this.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'", function (result) {
            var tables = [];
			for(var i=0; i < result.length; i++){
				tables.push(result[i].table_name);
			}
            callback(tables);
        });
    }

    // returns all columns from a table as an array ['column1', 'column2']
    getAllColumns(table, callback) {
        this.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '" + table + "'", function (result) {
            var cols = [];
			for(var i=0; i < result.length; i++){
				cols.push(result[i].column_name);
			}
            callback(cols);
        });
    }
}


exports.DB = DB