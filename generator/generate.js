const { initDataFolder, sortByKey } = require('./utils');
fs = require('fs');
const config = require('config');
const noop = () => {};
var dir = __dirname + '/../dist';

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

// write data to files
console.log('writing', parseInt(data.length/1000), 'files')
var indexFileContent = 'index #\n'
var linesInFile = 0
var contentToWrite = 'final #\n'
var nextFileName = 0
var firstLineInFile = ''

for (let i = 0; i < data.length; i++) {
	if (linesInFile < 1000) {
		contentToWrite += data[i][0] + ' ' + data[i][1] + '\n'
		if (linesInFile == 0) {
			firstLineInFile = data[i][0]
		}
		linesInFile += 1
	} else {
		fs.writeFileSync(dir + '/data/' + nextFileName + '.txt', contentToWrite, noop)
		linesInFile = 0
		contentToWrite = 'final #\n'
		indexFileContent += firstLineInFile + ' data/' + nextFileName + '.txt\n'
		firstLineInFile = ''
		nextFileName += 1
	}
}
if (linesInFile != 0) {
	fs.writeFileSync(dir + '/data/' + nextFileName + '.txt', contentToWrite, noop)
	indexFileContent += firstLineInFile + ' data/' + nextFileName + '.txt\n'
}

// WRITE indexFileContent
console.log('writing index file')
fs.writeFileSync(dir + '/data/index.txt', indexFileContent, noop)




// fs.writeFile('', data, [encoding], [callback])