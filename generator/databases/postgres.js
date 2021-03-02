const { Client } = require('pg')

class DB {
    constructor(config) {
        this.config = config
        this.connection = new Client(config.dbConfig)
        this.connection.connect()
        this.connection.query('SELECT NOW()', (err, result) => {
            if (err !== null) {
                console.log('SQL connection error:')
                console.log(err)
            }
        })
    }

    // call example: query("SELECT * FROM table WHERE aaa = :aaa AND bbb = :bbb",{ aaa: aaa, bbb: bbb })
    async query(query, params = []) {
        const result = await this.connection.query(query, params)
        return result.rows
    }

    async end() {
        await this.connection.end()
    }

    async getPrimary(table) {
        const result = await this.query(`SELECT kcu.column_name as key_column,
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
                position;`)
        if (result.length == 0) {
            throw "No Primary key found!"
        }
        return result[0].key_column
    }
	// returns all tables from a database as an array ['table1', 'table2']
    async getAllTables() {
        const result = await this.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");
        var tables = []
        for (var i=0; i < result.length; i++) {
            tables.push(result[i].table_name)
        }
        return tables
    }

    // returns all columns from a table as an array ['column1', 'column2']
    async getAllColumns(tableName) {
        const result = await this.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '" + tableName + "'")
        var cols = []
        for (var i=0; i < result.length; i++) {
            let colName = result[i].column_name
            cols.push(colName)
        }
        
        return cols
    }
}


exports.DB = DB