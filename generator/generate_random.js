const { initDataFolder, sortByKey, writeData } = require('./utils')
const { generateExampleDict } = require('./sample_data');

initDataFolder()

console.log('Generation example data')
var data = generateExampleDict(3)

console.log('Sorting', data.length, 'rows')
data.sort(sortByKey);

writeData(data, 'data')


// fs.writeFile('', data, [encoding], [callback])