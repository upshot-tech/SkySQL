const { initDataFolder, sortByKey, writeData, stringifyData, stringifyIndex } = require('./utils')

fs = require('fs')
const config = require('config')

const dbType = config.get('dbConfig.type')
const { DB } = require('./databases/' + dbType)
const db = new DB


fs.rmdirSync(__dirname + '/../dist', { recursive: true });

initDataFolder()


const tablesRaw = config.get('tables')
if(tablesRaw == '*') {
	const tables = db.getAllTables()
} else {
	const tables = config.get('tables', callback)
}

tables.forEach(table => {
	console.log("table.name: " + table.name)
	db.getPrimary(table.name, function(primaryIndex) {
		console.log('primaryIndex:', primaryIndex)
		
		let cols = table.columns.join()
		db.query('SELECT ' + cols + ' FROM ' + table.name, function(rawData) {

			data = stringifyData(rawData, primaryIndex)
			console.log('Sorting', data.length, 'rows')
			data.sort(sortByKey)
			writeData(data, table.name, 'data')

			var indexes = table.indexes
			indexes.forEach(index => {
				data = stringifyIndex(rawData, primaryIndex, index)
				console.log('Sorting', data.length, 'rows')
				data.sort(sortByKey)
				writeData(data, table.name, index)
			})
		})
	})
})
/* 
for tables:
	get primary index
	create data table
	for indexes:
		create index tables
 */





// fs.writeFile('', data, [encoding], [callback])