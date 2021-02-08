const config = require('config')

const dbType = config.get('dbConfig.type')
const { DB } = require('./databases/' + dbType)
const db = new DB

let database = config.get('dbConfig.database')
let tables = config.get('tables')
console.log('tables: ', tables)

db.getPrimary(tables[0].name, function(response) {
    console.log('Primary: ', response)
})


db.getAllTables(database, function(response) {
    console.log('tables: ', response)
})

db.getAllColumns(tables[0].name, function(response) {
    console.log('colomns: ', response)
})