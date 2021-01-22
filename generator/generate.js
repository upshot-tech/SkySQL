const { initDataFolder, sortByKey, writeData } = require('./utils')
const { MySQL } = require('./databases/mysql')
fs = require('fs')
const config = require('config')
const { exit } = require('process')
const mysql = new MySQL

initDataFolder()
var data = []

for (let index = 0; index < 1500; index++) {
	data.push([index, index])
}

const tables = config.get('tables')
tables.forEach(table => {

	mysql.getPrimary(table, function(primaryIndex) {
		console.log('primaryIndex:', primaryIndex)
	
		console.log('Sorting', data.length, 'rows')
		data.sort(sortByKey)
		writeData(data, 'data')
	
	
		/* 
		var indexes = table.indexes
		indexes.forEach(index => {
	
		})
		 */
	
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