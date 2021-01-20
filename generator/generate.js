const { initDataFolder, sortByKey, writeData } = require('./utils');
fs = require('fs');
const config = require('config');


initDataFolder()

var data = []

for (let index = 0; index < 1500; index++) {
	data.push([index, index]);
}

/* 
for tables:
	get primary index
	create data table
	for indexes:
		create index tables
 */


// Sort given data
console.log('Sorting', data.length, 'rows')
data.sort(sortByKey);

writeData(data, 'ddd')




// fs.writeFile('', data, [encoding], [callback])