const { initDataFolder, sortByKey, writeData } = require('./utils')
const { MySQL } = require('./databases/mysql')
fs = require('fs')
const config = require('config')


initDataFolder()

var data = []

for (let index = 0; index < 1500; index++) {
	data.push([index, index])
}

const tables = config.get('tables')
tables.forEach(table => {
	console.log('Sorting', data.length, 'rows')
	data.sort(sortByKey)	
	writeData(data, 'ddd')


	/* 
	var indexes = table.indexes
	indexes.forEach(index => {

	})
 	*/


})
/* 
for tables:
	get primary index
	create data table
	for indexes:
		create index tables
 */





// fs.writeFile('', data, [encoding], [callback])