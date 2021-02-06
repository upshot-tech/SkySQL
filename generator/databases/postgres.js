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
            callback(result.rows)
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
                callback(result[0].key_column)
            }
        )
    }
}


exports.DB = DB