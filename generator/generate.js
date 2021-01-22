const { initDataFolder, sortByKey, writeData, stringifyData, stringifyIndex } = require('./utils')
const { MySQL } = require('./databases/mysql')
fs = require('fs')
const config = require('config')
const { exit } = require('process')
const mysql = new MySQL

initDataFolder()


const tables = config.get('tables')
tables.forEach(table => {
	console.log(table.name)
	mysql.getPrimary(table.name, function(primaryIndex) {
		console.log('primaryIndex:', primaryIndex)
		
		let cols = table.columns.join()
		mysql.query('SELECT ' + cols + ' FROM ' + table.name + ' WHERE 1 LIMIT 10', function(rawData) {

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