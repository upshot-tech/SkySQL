const { initDataFolder, sortByKey, writeData, stringifyData, stringifyIndex,
		getTablesToExport, getColsToExport, getIndexesToExport, initTableName,
		exportObjectToFile, joinToString } = require('./utils')
fs = require('fs')
const { SkynetClient } = require('@nebulous/skynet')
const client = new SkynetClient()
const dir = __dirname + '/../dist'

exports.generate = async function generate(config)  {
	const { DB } = require('./databases/' + config.dbConfig.type)
	const db = new DB(config)
	
	// remove dist folder 
	fs.rmdirSync(dir, { recursive: true });

	// make new dist folder with initial files
	initDataFolder()

	const tables = await getTablesToExport(db, config)
	let structure = []
	// iterate on all tables
	for (table of tables) {

		// get primary indexed column
		const primaryIndex = await db.getPrimary(table.name)
		
		console.log('Exporting "' + table.name + '" table. Primary index:', primaryIndex)
		
		// get all column names for export
		const cols = await getColsToExport(db, table)
		const colStr = joinToString(cols)

		const tableQueryName = initTableName(table.name)
		const rawData = await db.query('SELECT ' + colStr + ' FROM ' + tableQueryName)
		const colData = stringifyData(rawData, primaryIndex)
		// console.log('Sorting', colData.length, 'rows')
		colData.sort(sortByKey)
		writeData(colData, table.name, 'data')

		const indexes = await getIndexesToExport(db, table)
		// export all indexes
		for (index of indexes) {
			const indexData = stringifyIndex(rawData, primaryIndex, index)
			//console.log('Sorting', indexData.length, 'rows')
			indexData.sort(sortByKey)
			writeData(indexData, table.name, index)
		}
		structure.push({'name': table.name, 'columns': cols, 'indexes': indexes })
	}
	db.end()
	exportObjectToFile(dir + '/structure.json', structure)
	const skylink = await client.uploadDirectory(dir)
	console.log('SkySQL data uploaded to', skylink)
	return skylink
}
